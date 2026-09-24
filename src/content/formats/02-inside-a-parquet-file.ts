import type { Section } from '../types'

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
