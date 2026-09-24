import type { Section } from '../types'

export const rowVsColumn: Section = {
  id: 'row-vs-column',
  title: 'Row-wise vs columnar',
  scene: 'fmt-row-vs-column',
  focus: 'col',
  slide: `## Row-wise vs columnar

Same data. Different **order on disk.**

| | Stores | Built for |
|---|---|---|
| **Row-wise** | all of row 1, then row 2 | *"this one record, all of it"* |
| **Columnar** | all of column 1, then column 2 | *"these 3 columns, all 10B rows"* |

CSV, JSON, Avro and every OLTP database are row-wise. Parquet and ORC are columnar.

### Which shape matches an analytical query
Analytics reads **few columns of many rows** — the exact opposite of what a row layout is good at.

- **Skip 197 columns** — never read, not read-then-discarded
- **Compress better** — like values sit next to like values

> Neither is better. They're answers to different questions. Spark's questions are analytical.`,
  narration:
    "Before anything about Parquet specifically, the distinction it rests on. Take the same table and write it to disk two ways. Row-wise means you store all of row one — every column of it — then all of row two, then row three. That's CSV, that's JSON, that's Avro, and that's how essentially every transactional database stores things. Columnar means you store all the values of column one, then all the values of column two. Every destination, together. Then every count, together. That's Parquet and ORC. Now, neither is better in the abstract. They're answers to different questions. A row layout is built for: give me this one record, all of it. If you're an online store looking up order number fifty thousand, you want every field of that order and you want it in one read. A row layout gives you exactly that. A columnar layout is built for: give me these three columns, for all ten billion rows. And that's analytics. When you compute a sum by destination over a year of events, you touch two or three columns and every row. So the shape of your access pattern is precisely the opposite of what a row layout optimises for. Two things follow. You can skip the columns you don't want — genuinely skip, seek past them on disk, not read them and discard them. And you compress far better, because when like values sit next to like values, there's much more redundancy for a compressor to find. Spark's questions are analytical, which is why Parquet is the default answer.",
}

export const insideAParquetFile: Section = {
  id: 'inside-a-parquet-file',
  title: 'Inside a Parquet file',
  scene: 'fmt-inside-parquet',
  focus: 'file',
  slide: `## Inside a Parquet file

**Hybrid**, not purely columnar. Split by rows *first*, then columnar **inside** each split.

\`\`\`
file
 ├── row group 1  (~128 MB of rows)
 │     ├── column chunk: dest   → pages
 │     ├── column chunk: country → pages
 │     └── column chunk: cnt    → pages
 ├── row group 2  (same three chunks)
 └── footer
\`\`\`

| | |
|---|---|
| **Row group** | a horizontal slice, **self-contained** |
| **Column chunk** | one column's values within that slice |
| **Page** | ~1 MB — the smallest unit that gets compressed |

### Why hybrid, rather than one column per file
A row group is a unit that can be **skipped whole** — and it's also the **unit of parallelism**, so one task reads one row group without needing anything from another.

> Pure columnar across a whole file would mean reconstructing a row needed reads from four corners of it.`,
  narration:
    "Let's open a Parquet file, because the structure explains everything that follows. The first surprise is that it's not purely columnar. It's hybrid. The file is split by rows first, into row groups — typically about a hundred and twenty-eight megabytes of rows each. And then within each row group, the data is stored columnar. So row group one contains a chunk for destination, a chunk for country, a chunk for count, each holding that column's values for the rows in that group. Then row group two does the same for the next slice of rows. Inside a column chunk, data is broken into pages of roughly a megabyte, and the page is the smallest unit that gets compressed. Now, why hybrid? Why not just store one column for the whole file, contiguously, which would be more purely columnar? Two reasons, and both matter. First, a row group is self-contained: everything needed to reconstruct those rows is in one place, so you can skip a whole row group without needing anything from it, and you can read one without reading its neighbours. Second, it's the unit of parallelism. One Spark task reads one row group. If a column spanned the entire file, splitting the work between tasks would mean each task reading fragments from all over it. So the structure is: the file is chopped into independent horizontal slices for parallelism and skipping, and each slice is columnar internally for compression and pruning. Both properties at once, which is why the design won.",
}

export const theFooter: Section = {
  id: 'the-footer',
  title: 'The footer: read the end first',
  scene: 'fmt-footer',
  focus: 'holds',
  slide: `## The footer

A Parquet reader starts at the **end** of the file. The last 8 bytes give the footer length and a magic number; it seeks back and reads the footer first.

### What the footer holds
| | |
|---|---|
| **The schema** | names, types, nesting |
| **Offsets** | where each column chunk begins |
| **min / max per chunk** | *everything in §5 rests on this* |
| **Null counts** | and distinct counts, sometimes |

Everything needed to decide **what not to read** — available before a single byte of data is touched.

### Which is why a Parquet file isn't streamable
You can't read it front to back. The map is at the end, so a **truncated file is unreadable**, not partly readable.

That's a real operational property: a job killed mid-write leaves a file nothing can open. It's one of the reasons table formats exist.

> Small files hurt partly because **every one costs a footer read** — metadata outweighing data.`,
  narration:
    "Here's a detail that seems like trivia and turns out to explain several behaviours: a Parquet reader starts at the end of the file. The last few bytes contain the footer length and a magic number. The reader seeks there, learns how big the footer is, seeks back, and reads the footer before touching any data. The footer is the map. It holds the schema — column names, types, and any nesting. It holds offsets, so the reader knows exactly which byte range each column chunk occupies. It holds statistics for every column chunk: the minimum value, the maximum value, and how many nulls. Sometimes distinct counts too. So before reading a single row, the reader knows the shape of the data and quite a lot about its contents. That's what makes everything in the next few sections possible. Now, two consequences. The first is operational: a Parquet file is not streamable. You cannot read it progressively from the front, because the map is at the back. Which means a truncated file isn't partly readable — it's unreadable. If a job dies halfway through writing, you get a file nothing can open. That's a genuine problem in practice and one of the reasons table formats like Delta and Iceberg exist. The second consequence is about small files, and it's worth flagging now because it comes back later. Every file costs a footer read. That's a seek and a read before any useful work. With a million tiny files you're doing a million of those, and the metadata genuinely outweighs the data.",
}

export const columnPruning: Section = {
  id: 'column-pruning',
  title: 'Column pruning',
  scene: 'fmt-column-pruning',
  focus: 'reads',
  slide: `## Column pruning

\`\`\`sql
SELECT dest, cnt FROM events
\`\`\`

The plan names exactly two attributes. The footer's offsets point straight at those two chunks.

| | |
|---|---|
| chunk: \`dest\` | **read** |
| chunk: \`cnt\` | **read** |
| 198 other chunks | **never touched** |
| bytes read | **~1%** |

Not read-and-discarded. **Seeked past.** The bytes never leave the disk.

### Which is the real cost of \`SELECT *\`
It isn't verbosity or style. It's a **100× increase in bytes read** on a wide table.

And it's silent — the query works, returns the right answer, and costs a hundred times what it needed to.

> Check it: \`ReadSchema\` in \`explain()\` lists what will actually be read. If it names 200 columns, something is forcing a full read.`,
  narration:
    "Column pruning is the simplest of the optimisations and often the largest. You write a query selecting two columns. The plan carries exactly two attributes. Spark hands the reader a list of two column names, the reader looks up their offsets in the footer, seeks directly to those byte ranges, and reads them. The other hundred and ninety-eight chunks are never touched. And I want to be precise about that, because people hear it as a filter. It's not. Those bytes are not read into memory and then discarded — they are never read. The disk head, or the object storage range request, skips over them entirely. If your two columns are one percent of the file's bytes, you transfer one percent of the file. Now, the practical consequence, and it's the most actionable thing in this course. SELECT star disables this completely. You've told Spark you need all two hundred columns, so it reads all two hundred. And the failure is silent — the query runs, it returns exactly the right answer, and it costs a hundred times what it needed to. Nothing warns you, because nothing is wrong. It's just expensive. This is why the advice to avoid SELECT star in production code isn't stylistic pedantry. In a row-based database it genuinely is mostly style. In a columnar format it's a hundredfold difference in I/O. And you can verify it in ten seconds: run explain and look at ReadSchema on the scan node. It lists what will actually be read. If it names two hundred columns when your query mentions three, something upstream is forcing a full read, and that's worth chasing.",
}

export const predicatePushdown: Section = {
  id: 'predicate-pushdown',
  title: 'Predicate pushdown, and why sortedness pays',
  scene: 'fmt-predicate-pushdown',
  focus: 'sorted',
  slide: `## Predicate pushdown

\`\`\`sql
WHERE cnt > 5000
\`\`\`

Pushed to the reader, which answers it from **statistics alone**:

| Row group | max \`cnt\` | |
|---|---|---|
| 1 | 400 | **skipped** — nothing can match |
| 2 | 120 | **skipped** |
| 3 | 9000 | read it — something might |

Two of three row groups are never opened. No rows decoded, no bytes transferred.

### Which is why sortedness is worth money
Statistics only exclude a group when its range is **narrow**.

| | |
|---|---|
| **Unsorted** | every group spans 0…9999 → **nothing skips** |
| **Sorted on the filter column** | each group is a tight range → most skip |

Sorting on the column you filter by is one of the highest-leverage things you can do at write time — and almost nobody does it.

> Also: \`IS NOT NULL\` pushes down too, using null counts.`,
  narration:
    "Predicate pushdown is where the footer statistics earn their place. Suppose your query has a filter: count greater than five thousand. Spark pushes that condition down into the Parquet reader. And the reader can now answer a useful question without reading any data at all: for each row group, the footer records the maximum value of count. If a row group's maximum is four hundred, then no row in that group can possibly have a count above five thousand. Skip it. Don't open it, don't decode it, don't transfer it. Three row groups, two of them excluded on the strength of a number in the footer. Now here's the part that's worth more than the mechanism, and it's underused. Statistics only let you skip a group when that group's range is narrow. Think about what happens with unsorted data. Your counts range from zero to ten thousand, randomly distributed. Every row group will contain some small values and some large ones, so every row group's min is near zero and every max is near ten thousand. The statistics are technically correct and completely useless — nothing can be excluded, because every group might contain a match. Now sort the data by count before writing it. Suddenly row group one holds zero to four hundred, group two holds four hundred to twelve hundred, and so on. Each group has a tight range, and a filter excludes most of them immediately. Same data, same format, same query — and the difference between reading everything and reading five percent. Sorting on the column you filter by is one of the highest-leverage write-time decisions available, and almost nobody does it.",
}

export const encodingCompression: Section = {
  id: 'encoding-and-compression',
  title: 'Encoding and compression are not the same thing',
  scene: 'fmt-encoding',
  focus: 'encodings',
  slide: `## Encoding ≠ compression

Two steps, and the first does more work.

| | |
|---|---|
| **Encoding** | a smarter *representation* — type-aware |
| **Compression** | generic squeezing, applied after |

### The encodings that do the real work
Each exploits a property a **column** has and a row never does:

- **Dictionary** — \`"United States"\` → \`0\`, stored once
- **Run-length** — \`0,0,0,0,0\` → \`(0 × 5)\`
- **Delta** — store differences; timestamps love this

A low-cardinality string column can shrink 50× **before any compressor runs.** Columnar doesn't use a better compressor — it gives one better *input*.

### Then a codec on top
\`snappy\` (default, fast, splittable) · \`zstd\` (smaller, worth testing) · \`gzip\` (slowest to read)`,
  narration:
    "People talk about Parquet compression as one thing. It's two, and the first one does most of the work. Encoding comes first, and it's type-aware — it understands what kind of data it's looking at and picks a smarter representation. Dictionary encoding is the classic: if your country column has two hundred distinct values across a billion rows, store the two hundred strings once in a dictionary and then store a small integer per row. The string United States, which is thirteen bytes, becomes a single number. Run-length encoding: if a column has the same value repeated, store the value and a count instead of the repetitions. Delta encoding: for sorted or near-sorted numbers like timestamps, store the differences between consecutive values, which are tiny, instead of the values, which are large. A low-cardinality string column can shrink by fifty times before any compressor has run. Then compression happens on top, and it's generic — snappy or zstd or gzip, squeezing bytes without understanding them at all. And this is the honest answer to why columnar formats compress so much better than row formats. It's not that they use a better compressor; they use the same compressors. It's that they hand the compressor much better input. All the destination values sitting next to each other are enormously more redundant than a row of a destination, a timestamp, a user id and a price. On codecs: snappy is the default, and the reason is that it's fast to decompress and splittable. Gzip compresses smaller but decompresses slowly, and you decompress far more often than you write. Zstd sits between them and is usually worth testing.",
}

export const partitionedDirectories: Section = {
  id: 'partitioned-directories',
  title: 'Partitioned directories are an index',
  scene: 'fmt-partitioned-dirs',
  focus: 'wrong',
  slide: `## Partitioned directories

\`\`\`
events/year=2026/month=09/part-0000.parquet
\`\`\`

Written by \`partitionBy("year", "month")\`. The **directory names are the index** — and the values aren't stored in the files at all.

### Which makes the column free, twice over
- **No bytes on disk** — \`year\` is inferred from the path
- **A filter on it is answered by listing paths**, before a file is opened

\`WHERE year = 2026\` skips entire directories without reading anything.

### And how it goes wrong
The column must be **low-cardinality** and **actually filtered on.**

| | |
|---|---|
| Partitioning by \`user_id\` | a million directories, one tiny file each |
| Nobody filters on it | all of the cost, none of the benefit |

> Rule of thumb: partitions should hold **at least ~1 GB** each. If they don't, you've partitioned by too much.`,
  narration:
    "There's a second kind of skipping, and it happens before any file is opened. When you write with partitionBy on year and month, Spark doesn't put those values in the files. It puts them in the directory names — year equals twenty twenty-six, slash, month equals zero nine. The convention comes from Hive and it's understood by essentially every tool in this ecosystem. Two things follow, and both are genuinely free. First, the column costs no storage at all. Every row in that directory has year twenty twenty-six, so storing it a billion times would be waste; Spark infers it from the path when reading. Second, and more importantly, a filter on a partition column is answered by listing directories. Where year equals twenty twenty-six means: list the paths, discard the ones that don't match, and only then start opening files. Entire years of data are excluded without a single byte being read. Now, how this goes wrong, because it goes wrong constantly. The partition column has to satisfy two conditions. It must be low-cardinality — a modest number of distinct values. And it must be something people actually filter on. Partition by user id and you get a million directories each holding one tiny file, and you've created the small-file problem we'll come to next, at enormous scale. Partition by something nobody filters on and you've paid all the costs for no benefit. The rule of thumb worth carrying: each partition should hold at least something like a gigabyte. If your partitions are megabytes, you've partitioned by too much — use day instead of hour, or drop a level entirely.",
}

export const twoKindsOfPruning: Section = {
  id: 'two-kinds-of-pruning',
  title: 'Four things the reader gets to skip',
  scene: 'fmt-two-prunings',
  focus: 'ladder',
  slide: `## Four things the reader skips

Coarsest first. **Each rung is cheaper than the one below**, because it's decided with less read.

| | Skips | Decided from |
|---|---|---|
| **1** | whole directories | the **path** alone |
| **2** | whole files | the footer — no data read |
| **3** | row groups | min/max in the footer |
| **4** | pages | the page index, if present |

### And only then, what's left
The filter finally runs **on rows** — on whatever survived all four.

### Which reframes what "Parquet is fast" means
Parquet isn't fast because it reads quickly. It's fast because of **everything it gets to not read.**

Every one of those four rungs is a decision made from metadata. That's the whole design — and it's why a format with no metadata (§11) can't do any of it.

> Layout is what makes rungs 1 and 3 work: partitioning feeds the first, sortedness feeds the third.`,
  narration:
    "Let's put the skipping in one place, because seeing the ladder is more useful than any individual rung. There are four things a Parquet reader can skip, and they get coarser as you go up. Rung one: whole directories, decided from the path alone. Partition pruning. Nothing is opened. Rung two: whole files, decided from the footer — the reader opens the footer, sees that this file's statistics rule out every row, and closes it without reading data. Rung three: row groups within a file, from the min and max statistics. Rung four: individual pages within a column chunk, using the page index, which newer Parquet versions carry. And only after all four does the filter actually run on rows — on whatever survived. Now here's the reframing I'd like to leave you with. Parquet is not fast because it reads quickly. Snappy-compressed columnar data is not dramatically faster to read, byte for byte, than anything else. Parquet is fast because of everything it gets to not read. Every rung on that ladder is a decision made from metadata, arrived at before the corresponding data is touched. And that tells you where your leverage is. Rungs two and four are automatic — the format handles them. Rungs one and three depend on choices you make at write time. Partitioning feeds rung one; if you partition on nothing, you never skip a directory. Sortedness feeds rung three; if your data is randomly ordered, your statistics are useless and you never skip a row group. So layout is not a detail. Layout is what determines how much of the ladder you actually get.",
}

export const smallFileProblem: Section = {
  id: 'the-small-file-problem',
  title: 'The small file problem',
  scene: 'fmt-small-files',
  focus: 'costs',
  slide: `## The small file problem

Nobody chooses this. It's what a streaming job or an over-partitioned write does **by default** — 200 partitions × 365 days is 73,000 files, unnoticed.

### Three costs, and the first is the worst
| | |
|---|---|
| **Listing, on the driver** | every file enumerated *before any executor starts*. One API call each on object storage — **minutes** of idle cluster. |
| **A task per file** | scheduling a task to read 4 KB |
| **A footer read per file** | metadata outweighing data |

### The fixes
- **\`repartition\` before write** — control the file count
- **Compact on a schedule** — rewrite yesterday into few files
- **Partition by less** — day not hour

> Aim for **128 MB – 1 GB** per file.`,
  narration:
    "Every property that makes Parquet good assumes files of a reasonable size. When they aren't, all of it inverts. And nobody chooses to have a million tiny files — it's what happens by default. A streaming job writing every minute produces one file per partition per run: that's fourteen hundred runs a day, times however many partitions. A batch job with two hundred shuffle partitions, writing daily for a year, produces seventy-three thousand files without anybody doing anything wrong. Three costs, and the first one is much worse than people expect. Before any executor does any work, the driver has to enumerate the files. Listing. On a local filesystem that's fast. On cloud object storage it's an API call per prefix, and it's happening on a single-threaded driver, and for a million files it takes minutes during which your entire cluster sits completely idle, paid for and doing nothing. The second cost: each file is at least one task. You're paying the scheduling overhead of a task — serialising it, shipping it, tracking it — to read four kilobytes. The third: a footer read per file, which is a seek and a read before any useful data. Metadata genuinely outweighing data. The fixes are straightforward. Repartition before writing, which lets you control the output file count directly. Compact on a schedule — a job that rewrites yesterday's thousands of small files into a handful of large ones. And partition by less: day instead of hour, or drop a partitioning level entirely. The target to aim for is somewhere between a hundred and twenty-eight megabytes and a gigabyte per file. The exact number doesn't matter much; the order of magnitude does.",
}

export const schemaEvolution: Section = {
  id: 'schema-evolution',
  title: 'What you can change, and what you can\'t',
  scene: 'fmt-schema-evolution',
  focus: 'merge',
  slide: `## Schema evolution

Parquet matches columns **by name**, not position. That's what makes some changes safe.

### Safe
**Add a column** — old files read it as \`null\`. **Reorder** — position was never load-bearing.

### Not safe
| | |
|---|---|
| **Rename** | it's a *new* column; the old reads null |
| **Narrow a type** | \`long → int\` has nowhere to put the value |
| **Drop, re-add, new type** | worst — incompatible files, same name |

Widening (\`int → long\`) is usually fine. Narrowing never is.

### \`mergeSchema\` is off by default, rightly
It reads **every file's footer** to build a union — fine for ten files, ruinous for a million, and single-threaded on the driver.

> Parquet gives conventions, not enforcement. A table format gives enforcement.`,
  narration:
    "Data outlives the code that wrote it, so schemas change, and it's worth knowing which changes are survivable. The key fact underneath all of this: Parquet matches columns by name, not by position. That's why some changes are safe. Adding a column is safe. New files have it, old files don't, and when Spark reads a mix it fills in null for the files that predate it. Reordering columns is safe, because position was never what identified them. Now the unsafe ones. Renaming a column is not a rename as far as Parquet is concerned — it's a new column with a new name, and the old one has simply ceased to exist. Files written before the change have data under the old name, files after have it under the new one, and reading them together gives you two columns, each half null. Narrowing a type is unsafe for the obvious reason: if you change a long to an int, there's nowhere to put values that don't fit. Widening — int to long — is generally fine. And the worst case is dropping a column and later re-adding the same name with a different type, which gives you files that genuinely cannot be reconciled. There's an option called mergeSchema that handles some of this by reading every file's footer and building a union of all the schemas it finds. It's off by default, and it should be. For ten files it's fine. For a million it's catastrophic, and it's a driver-side single-threaded cost, so your cluster idles while it happens. The honest summary is that Parquet gives you conventions, not enforcement. If you want a schema that's actually checked at write time, that's what a table format provides.",
}

export const csvAndJson: Section = {
  id: 'csv-and-json',
  title: 'Why CSV and JSON can\'t do any of this',
  scene: 'fmt-csv-json',
  focus: 'do',
  slide: `## CSV and JSON

Every optimisation in this course rested on **metadata**. A text format has none of it.

| | |
|---|---|
| **No schema** | everything is text until parsed |
| **No statistics** | nothing to skip on |
| **No column layout** | no pruning possible |
| **No footer** | read it, or don't |

### And \`inferSchema\` costs a whole extra pass
Spark reads the data **once to guess types**, then again to load it. On a large file that's double the I/O before any work.

\`\`\`python
spark.read.schema(my_schema).csv(path)   # one pass
\`\`\`

### So: declare the schema, and convert once
CSV and JSON are **interchange** formats. Fine at the edge of a system — how data arrives, how it leaves. Wrong as a place to *keep* data.

Read it once, write Parquet, and every query after that gets the whole ladder from §8.

> A guessed schema is also a *wrong* schema eventually — one file with an odd value and your id column becomes a string.`,
  narration:
    "Let's finish by looking at what happens without any of this, because it makes the case better than praising Parquet does. Take a CSV. What does it have? No schema — everything is text until something parses it, so there's no way to know that column three is an integer without reading it. No statistics, so there is nothing to skip on; a filter has to examine every row. No column layout, so column pruning is impossible — the columns are interleaved on every line, and to get past one you have to read it. And no footer, no index, no map of any kind. You read the file or you don't. So every optimisation we've discussed simply doesn't apply. And there's an extra cost specific to reading text with Spark: schema inference. If you don't supply a schema, Spark reads the data once to guess the types, then reads it again to actually load it. That's double the I/O before any work happens. Passing an explicit schema eliminates the first pass entirely, and it's worth doing even for exploratory work on anything large. It also eliminates a subtler problem: a guessed schema is eventually a wrong schema. One file where an id column contains a value with a leading zero, or an empty string, and Spark infers string instead of integer — and now your join keys don't match across files. So the practical stance is this. CSV and JSON are interchange formats. They're fine at the edges of a system: how data arrives from a partner, how it leaves for a spreadsheet. They are the wrong place to keep data. Read it once, with an explicit schema, write Parquet, and every query after that gets the whole skipping ladder.",
}
