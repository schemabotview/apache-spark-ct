import type { Section } from '../types'

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
