import type { Section } from '../types'

export const skew: Section = {
  id: 'skew',
  title: 'Skew: one key, one task, one hour',
  scene: 'shuffle-skew',
  focus: 't-8',
  slide: `## Skew: one key, one task, one hour

199 of 200 tasks finish in 12 seconds. The stage runs for an hour. **Adding executors changes nothing.**

### The partitioner is not broken
Hashing spreads **keys** evenly. Nobody promised your **rows** were spread evenly over the keys.

- \`user_id = NULL\` — 38% of rows, and NULL is one key
- \`user_id = "guest"\` — every logged-out session
- \`country = "US"\`, \`tenant = <your biggest customer>\`

All rows for one key go to **exactly one task**. By design — that's what makes the aggregate correct.

### Why more hardware doesn't help
A stage finishes when its **slowest** task finishes (§2). Task 8 is one thread on one core. 200 more executors will not split it.

### Reading it
Stage duration, **max vs median**: within ~2× is normal, **100×** is skew.

> Before salting anything: check whether the hot key is \`NULL\`, and whether you needed those rows at all.`,
  narration:
    "This is the failure everybody meets eventually, and it looks like the cluster is broken. You open the Spark UI. A stage has two hundred tasks. A hundred and ninety-nine of them went green in about twelve seconds. One is still running. Forty minutes later it's still running. You add more executors, and absolutely nothing changes. That's skew. Here's what's actually happening, and the important thing is that nothing is malfunctioning. The partitioner hashes the key and sends every row with that key to the same task — which it has to, because that's the only way the aggregate comes out right. Hashing spreads keys evenly. But nobody ever promised your rows were spread evenly over your keys. In real data they never are. If thirty-eight percent of your rows have a null user id — and null is just a key like any other — then thirty-eight percent of your data lands on a single task. Same story with a guest user id for logged-out sessions, or a country column where a third of your traffic is the United States, or a tenant column where one customer is a hundred times bigger than the rest. And now recall the barrier from section two: a stage finishes when its slowest task finishes. Not the average. So that one task is holding the entire cluster hostage, and it can't be helped by scale, because it is one thread on one core working through four hundred million rows. Two hundred more executors will not split it. Spot it by comparing the maximum task duration against the median in the stage summary. Normal is within about two times. Skew is a hundred. And before you reach for any clever fix — check whether the hot key is null, and whether you actually wanted those rows at all.",
}
