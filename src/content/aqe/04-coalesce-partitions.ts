import type { Section } from '../types'

export const coalescePartitions: Section = {
  id: 'coalesce-partitions',
  title: 'Coalescing: the end of tuning shuffle.partitions',
  scene: 'aqe-coalesce',
  focus: 'why',
  slide: `## Coalescing partitions

The filter upstream removed 99% of the rows. Nothing downstream was told, so you get **200 partitions holding 8 MB each** — scheduling a task costs more than the work in it.

### After
AQE merges **contiguous** partitions toward a target:

\`\`\`
spark.sql.adaptive.advisoryPartitionSizeInBytes = 64MB
\`\`\`

200 partitions become about 12. Same data, a twelfth of the tasks.

### Why this is worth more than it sounds
It makes the old advice **obsolete**. You used to size \`spark.sql.shuffle.partitions\` for the whole query — one number, serving a stage that shuffles 2 TB and a stage that shuffles 40 MB.

Now: **set it high and let AQE bring it down, per stage.** One number never fitted all of them.

> Contiguous merging only. It combines neighbours; it can't redistribute, which is why it fixes *too many small*, never *one too big*. That's §6.`,
  narration:
    "The first thing AQE does with those statistics is the one you'll see most often. Here's the situation. Your job reads a large table, applies a filter that removes ninety-nine percent of the rows, and then groups by something. The shuffle after that filter produces two hundred partitions, because two hundred is the default, and those two hundred partitions hold about eight megabytes each. So you're scheduling two hundred tasks, each with its own serialisation and dispatch and tracking overhead, to process eight megabytes. The overhead genuinely exceeds the work. AQE looks at the measured sizes and merges contiguous partitions together, aiming at a target size — advisoryPartitionSizeInBytes, sixty-four megabytes by default. Two hundred partitions become about twelve. Identical data, a twelfth of the task count, and the scheduling overhead essentially disappears. Now, why does this matter more than a modest speedup? Because it makes a whole category of tuning obsolete. Previously you set spark dot sql dot shuffle dot partitions once, for the entire query. But a real query has several stages, and one of them might shuffle two terabytes while another shuffles forty megabytes. One number cannot be right for both. You'd pick something in the middle and be wrong twice. With AQE the advice inverts: set it high — so no individual stage is starved of parallelism — and let AQE bring it down per stage, using measurements. One caveat worth knowing. The merging is contiguous: it combines neighbouring partitions. It cannot redistribute. So it fixes the problem of too many small partitions, and never the problem of one partition that's too big. That's a different mechanism.",
}
