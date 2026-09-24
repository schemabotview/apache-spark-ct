import type { Section } from '../types'

export const theThree: Section = {
  id: 'the-three',
  title: 'Delta, Iceberg, Hudi',
  scene: 'lake-the-three',
  focus: 'table',
  slide: `## Delta, Iceberg, Hudi

All three are **a log beside Parquet.** Everything in this course applies to all of them.

| | Metadata | Origin |
|---|---|---|
| **Delta** | a JSON log, checkpointed to Parquet | Databricks |
| **Iceberg** | a tree: snapshot → manifests → files | Netflix |
| **Hudi** | a timeline, with record-level indexes | Uber |

### The honest advice
**The mechanism matters. The choice rarely does.**

All three give atomic commits, snapshot isolation, time travel, schema enforcement and \`MERGE\`. The differences show at extremes most people never reach.

Pick what your platform supports, and spend the saved time on **layout** — that's where the order-of-magnitude wins are.

> Course 1 said no owner means no guarantees. This is the layer that gives them back.`,
  narration:
    "Let's close by naming the three implementations, and then being honest about how much the choice matters. Delta Lake came out of Databricks. Its metadata is a JSON log, periodically checkpointed into Parquet so you don't replay thousands of entries. It's the most tightly integrated with Spark and usually the default if you're on Databricks. Apache Iceberg came out of Netflix. Its metadata is a tree — a snapshot points to a manifest list, which points to manifests, which point to files. That indirection costs a little complexity and buys efficiency on genuinely enormous tables, and it was designed from the start for engine neutrality, so Trino, Flink and Spark are all first-class. Apache Hudi came out of Uber. Its metadata is a timeline with record-level indexes, and it was built around upserts and incremental pulls, which shows in how good it is at those. Now the honest advice, and I want to give it clearly because a lot of energy goes into this comparison. The mechanism matters enormously. The choice between them rarely does. All three give you atomic commits, snapshot isolation, time travel, schema enforcement, and MERGE. The differences emerge at extremes — tables with hundreds of thousands of partitions, or upsert rates measured per second. Most people are not at those extremes. So pick whichever your platform supports best, and spend the time you saved on layout: partitioning, file sizes, sortedness. That's where the order-of-magnitude wins actually are. And with that we've come full circle. Right at the start, we said Spark deliberately owns no storage, and that outliving Hadoop was the reward — but no owner means no guarantees. This is the layer that hands the guarantees back, without taking the openness away.",
}
