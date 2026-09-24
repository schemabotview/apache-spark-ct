import type { Section } from '../types'

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
