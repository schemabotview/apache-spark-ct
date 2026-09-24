import type { Section } from '../types'

export const theSameEngine: Section = {
  id: 'the-same-engine',
  title: 'Two lines change',
  scene: 'str-same-engine',
  focus: 'shared',
  slide: `## Two lines change

\`read\` → \`readStream\`. \`write\` → \`writeStream\`. **Everything between is identical.**

### And identical means identical
| | |
|---|---|
| **Catalyst** | the same optimizer, the same rules |
| **Tungsten** | the same generated code |
| **The shuffle** | the same mechanism — and the same skew |

There is no second engine. The batch engine is run incrementally.

### Which means two things you might not expect
- Everything you know about tuning batch Spark **applies unchanged**
- Streaming jobs get skewed, spill, and suffer from 200 default shuffle partitions — for **exactly** the same reasons

> A slow streaming query is usually a slow Spark query, and debugs the same way.`,
  narration:
    "Here's the claim made concrete. Take a batch job: read a parquet directory, group by destination, count, write the result. Now make it streaming. You change read to readStream. You change write to writeStream. That's it. Everything between those two lines is character-for-character identical. And identical means identical, not analogous. The same parser produces the same tree. The same analyzer resolves the same names. Catalyst applies the same optimization rules — predicate pushdown, column pruning, all of it. Tungsten generates the same fused loops. A groupBy produces a shuffle, with the same partitioner and the same two hundred default partitions. There is no second engine hiding behind the streaming API. The batch engine is being run incrementally. Two consequences follow, and both are practically useful. The first is happy: everything you know about tuning batch Spark applies unchanged. Reading a plan, counting Exchanges, checking for pushdown, sizing partitions — all of it transfers. You are not learning a new performance model. The second is less happy but equally useful: streaming jobs get skewed, spill to disk, and suffer from badly-sized shuffle partitions, for exactly the same reasons batch jobs do. People sometimes treat a slow streaming query as a mysterious streaming problem and go looking for streaming-specific settings. Usually it's just a slow Spark query, and it debugs the same way — look at the plan, look at the stages, find the skewed task.",
}
