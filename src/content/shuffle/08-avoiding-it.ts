import type { Section } from '../types'

export const avoidingIt: Section = {
  id: 'avoiding-it',
  title: 'Three ways out, and they are the same way',
  scene: 'shuffle-avoiding',
  focus: 'ways',
  slide: `## Three ways out, and they are the same way

A shuffle exists because rows that must meet are on different machines. So: move the *other* side, pay it *once*, or be colocated *already*.

### Broadcast join — move the other side
- Ship the small table **whole** to every executor. Zero shuffle of the big one.
- Automatic under \`spark.sql.autoBroadcastJoinThreshold\` (~10 MB)
- ⚠️ The table goes **through the driver**. Forcing \`broadcast()\` on something large OOMs it.

### Bucketing — pay it once, at write time
\`bucketBy(320, "user_id")\` at write time. Stored pre-partitioned, so the join shuffles **neither** side.
- ⚠️ Both tables need the **same column and bucket count**, or you get nothing

### Reuse the partitioning — be colocated already
Two aggregations on the same key can share **one** shuffle. One stray \`repartition\` throws that away — count the \`Exchange\`s in \`explain()\`.`,
  narration:
    "So what do you actually do about it? There are three standard answers, and they're usually taught as an unrelated list of tricks. They aren't. Go back to the definition: a shuffle exists because rows that need to meet are sitting on different machines. So every fix is some way of making that not be true. The first is the broadcast join. If one side of your join is small — a lookup table, a dimension, a few thousand country codes — then instead of shuffling both sides to bring matching rows together, just send the whole small table to every executor. Now every machine has the entire small side locally, and the big side never moves at all. Spark does this automatically when it believes a table is under about ten megabytes. The catch is that the small table travels through the driver, so if you force a broadcast on something that isn't actually small, you don't get a slow job, you get a dead driver. The second is bucketing, which is the same idea moved in time. Instead of avoiding the shuffle, you pay for it once, at write time, and store the table already partitioned by the join key. Every future join on that key shuffles neither side. It's the best option for a table that gets joined the same way every day — as long as both sides use the same column and the same bucket count, because if they don't, you get no benefit at all and no warning either. And the third is simply not to throw away partitioning you already have. If you aggregate by user id and then aggregate by user id again, Spark can reuse the first shuffle — unless something in between repartitions and destroys the layout. The way to check is to count the Exchanges in your plan. Two where you expected one means you paid twice.",
}
