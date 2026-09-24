import type { Section } from '../types'

export const thePartition: Section = {
  id: 'the-partition',
  title: 'The partition is the unit of everything',
  scene: 'rdd-partition',
  focus: 'ceiling',
  slide: `## The partition is the unit of everything

One logical collection, many physical pieces. You write code against the whole thing; Spark runs it **once per partition**.

A partition is the unit of:
- **Parallelism** — one task processes exactly one partition
- **Placement** — it lives on one machine at a time
- **Recovery** — it's what gets recomputed when a node dies

### Parallelism is the smaller of two numbers
\`min(partitions, task slots)\`. 1000 partitions on 4 cores is still **4 at a time**. 4 partitions on a 200-core cluster wastes 196.

### Where the count comes from
| | |
|---|---|
| **On read** | file size ÷ 128 MB |
| **After a shuffle** | \`spark.sql.shuffle.partitions\` (200) |
| **When you say so** | \`repartition\` · \`coalesce\` |

Both defaults know nothing about your data.`,
  narration:
    "The partition is the single most important unit in Spark, because it's the unit of three different things at once. Your data is one logical collection, split into many physical pieces. You write code against the whole collection — filter this, map that — and Spark runs that code once per partition, in parallel. First, it's the unit of parallelism. One task processes exactly one partition. Not half of one, not two. So the number of partitions is the maximum number of things that can happen simultaneously. Second, it's the unit of placement. A partition lives on one machine at a time. That's what makes a join expensive: two rows that need to meet might be in partitions on different machines. Third, it's the unit of recovery. When a node dies, Spark doesn't rebuild your dataset — it rebuilds the specific partitions that were lost. Now, the arithmetic people get wrong. Your actual parallelism is the smaller of two numbers: how many partitions you have, and how many task slots exist. A thousand partitions on a four-core laptop still runs four at a time — the other nine hundred and ninety-six queue. And four partitions on a two-hundred-core cluster uses four cores and wastes the rest, no matter how much you paid for them. Where does the count come from? It changes constantly, which surprises people. When you read files, it's roughly the total size divided by a hundred and twenty-eight megabytes. After any shuffle, it's spark dot sql dot shuffle dot partitions, which defaults to two hundred. And it's whatever you say if you call repartition or coalesce. Both of those defaults are fixed numbers that know nothing whatsoever about your data.",
}
