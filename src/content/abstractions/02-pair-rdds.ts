import type { Section } from '../types'

export const pairRdds: Section = {
  id: 'pair-rdds',
  title: 'Pair RDDs, aggregation and partitioning',
  scene: 'pair-rdd-aggregation',
  focus: 'pair-lineage',
  slide: `## Pair RDDs and aggregation

A **pair RDD** holds \`(key, value)\` tuples, which unlocks the by-key operations.

### Worked: sales per store
- \`(store_id, amount)\` pairs from the 4 completed orders
- \`reduceByKey(add)\` → **7: 65.0, 9: 15.0, 12: 80.0**
- \`numPartitions=3\` sets the output partition count

### reduceByKey versus groupByKey
- \`reduceByKey\` adds within each partition **before** the shuffle
- \`groupByKey\` ships **every value**, then builds lists
- The lineage shows the shuffle: \`ShuffledRDD\` and the \`+-(2)\` indent

### The misconception
"Group, then sum, costs the same." For aggregation, the 4.0.1 guide says \`reduceByKey\` or \`aggregateByKey\` performs **much better**.`,
  narration:
    "When the records of an RDD are two item tuples, Spark treats the first item as a key, and a whole family of by-key operations becomes available. Here, each completed order becomes a pair of store id and amount. Reduce by key with addition then produces one total per store: sixty five for store seven, fifteen for store nine, and eighty for store twelve. Those are the same numbers as the first chapter's partial-sum example, now computed by Spark. Reduce by key is a wide operation, and the lineage shows it. There is a shuffled RDD, and the line marked with a plus and an indent is where one stage ends and the next begins. You can set how many partitions the result has. Passing num partitions equals three gives three output partitions. Now compare group by key. It returns every value for each key, so store seven comes back as a list of forty and twenty five. To get there, every single value has to cross the shuffle. Reduce by key instead adds values inside each partition first, and only sends partial totals. On six rows you cannot see the difference. On two hundred gigabytes you certainly can. That is why grouping and then summing is not equivalent in cost, and why the Spark four point zero point one guide says that for aggregations, reduce by key or aggregate by key will yield much better performance.",
}
