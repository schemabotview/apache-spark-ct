import type { Section } from '../types'

export const pairRdds: Section = {
  id: 'pair-rdds',
  title: 'Pair RDDs: why the key changes everything',
  scene: 'rdd-pairs',
  focus: 'classic',
  slide: `## Pair RDDs

Just an RDD of \`(key, value)\` tuples. No new type — but the key is what every distributed operation is defined against.

Partitioning, grouping and joining are all one instruction: *put the same key in the same place.*

### The oldest optimisation in Spark
\`\`\`
rdd.groupByKey().mapValues(sum)
rdd.reduceByKey(lambda a, b: a + b)
\`\`\`
Identical answers. A million rows over a hundred keys:

| | Crosses the network |
|---|---|
| \`groupByKey\` | **1,000,000** values |
| \`reduceByKey\` | **~100** per partition |

The second combines *within* each partition first — a **map-side combine**.

> In the DataFrame API you don't get to make this mistake: the optimizer always combines.`,
  narration:
    "A pair RDD is an RDD of two-element tuples. Key and value. There's no special class and no new type — if your elements happen to be tuples, Spark makes a set of extra operations available. But the key matters more than that framing suggests, because the key is what every distributed operation is defined against. Think about what partitioning, grouping and joining actually have in common. Every one of them is the same instruction: put the same key in the same place. Hash the key, send it to a partition. Group by key: same place. Join on key: same place. Repartition by key: same place, explicitly. All of it needs a key to exist. Which is why groupByKey, reduceByKey, aggregateByKey, join, cogroup and partitionBy all live on pair RDDs and nowhere else. Now let me show you the oldest optimisation in Spark, because it's still the clearest illustration of why any of this matters. Say you want a total per key. You could call groupByKey and then sum the values. Or you could call reduceByKey with an addition function. Same answer, both correct. Here's the difference. GroupByKey moves every single row across the network and then combines. With a million rows over a hundred keys, a million values cross the wire. ReduceByKey combines within each partition first — so each partition sends at most one value per key it saw, maybe a hundred values instead of a million. That's called a map-side combine, and it's the same idea as a combiner in MapReduce. Ten thousand times less network traffic for an identical result. And here's the closing point. In the DataFrame API you don't get to make this mistake, because the optimizer always does the combine for you. That's one of the clearest reasons the structured API beats hand-written RDD code: it doesn't forget.",
}
