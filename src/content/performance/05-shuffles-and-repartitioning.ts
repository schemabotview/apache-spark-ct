import type { Section } from '../types'

export const shufflesAndRepartitioning: Section = {
  id: 'shuffles-and-repartitioning',
  title: 'Control shuffles and repartitioning',
  scene: 'shuffle-control',
  focus: 'coalesce-trade',
  slide: `## Controlling shuffles

### What each call does to the plan
- \`repartition(8)\`: a full shuffle, **RoundRobinPartitioning** → 8 files
- \`coalesce(2)\`: merges partitions, **no Exchange** → 2 files
- \`repartition("sale_date")\`: hash shuffle into 200 — and AQE coalesced it, so only **5** files for 30 dates

### Worked: one output file, two ways
- \`coalesce(1)\`: the whole upstream stage ran as **one task** — 4.73 s
- \`repartition(1)\`: 4 parallel tasks, then **749 MB** shuffled — 4.76 s

**Rule:** repartition only when a later step needs it; for files per value, use \`partitionBy\`.

### The misconception
"\`coalesce\` is free." It avoids a shuffle by **shrinking** the parallelism of the work before it.`,
  narration:
    "Many shuffles are written by hand, with repartition and coalesce, so it pays to know exactly what each one costs. Repartition with a number always shuffles. The plan shows a round robin exchange, and the write produced eight files. Coalesce reduces partitions without any exchange at all, by merging existing ones, so two partitions gave two files. Repartition by a column hashes rows by that column into two hundred partitions. You might expect one file per day, thirty in all, but adaptive execution coalesced the partitions and the write produced only five. If you need one folder per value, partition by on the write is the tool for that, not repartition. Now the trade that surprises people. We needed one output file from eight million completed orders, and did it both ways. Coalesce one produced no shuffle, but it pulled the whole upstream stage into a single task: one task read all ten million rows. Repartition one kept four parallel tasks for the reading and filtering, then shuffled seven hundred and forty nine megabytes into one final task. The two took almost exactly the same time, four point seven three and four point seven six seconds, for entirely different reasons. So the misconception is that coalesce is free. It avoids a shuffle by shrinking the parallelism of the work before it. Repartition only when a later step genuinely needs the new layout.",
}
