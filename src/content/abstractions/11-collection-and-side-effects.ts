import type { Section } from '../types'

export const collectionAndSideEffects: Section = {
  id: 'collection-and-side-effects',
  title: 'Driver collection and distributed side effects',
  scene: 'driver-collection',
  focus: 'collection-rules',
  slide: `## Results and side effects

### Bringing rows to the driver
- \`take(n)\` / \`limit(n)\`: **bounded**
- \`collect()\`: **every row**, into one process's memory
- \`toLocalIterator()\`: one partition at a time
- \`spark.driver.maxResultSize\` = **1g**: past it, the job is **aborted**

### Side effects inside tasks
- \`foreach\` / \`foreachPartition\` run **on executors**
- A retried task **repeats** its external calls
- Make them **idempotent**: keys, upserts, or Spark's own writers

### The misconception
"\`collect()\` is fine — it worked on my sample." Three rows here; on the full workload the same line can exhaust the driver.`,
  narration:
    "Sooner or later results leave the cluster, and there are two ways that goes wrong. The first is size. Take and limit bring back a bounded number of rows, so take two returns exactly two. Collect brings back every row into the memory of a single process, the driver. To iterate without holding everything at once, to local iterator fetches one partition at a time. Spark also has a guard, spark dot driver dot max result size, one gigabyte by default. If the serialized results of an action exceed it, the job is aborted rather than crashing the driver. The second problem is side effects. Foreach and foreach partition run your function on the executors, inside tasks. If that function calls an external system, for example posting each row to an API, remember the previous chapter. Tasks can be retried, and a retried task repeats every call it already made. So design those calls to be idempotent: use a stable key, prefer upserts over inserts, or let Spark's own writers handle the output. Now the misconception, and it is the most common production bug in this chapter. Collect worked on the sample, so it must be fine. Here the result had three rows. On the full retail workload, the identical line can try to pull hundreds of gigabytes into one process. Aggregate or limit first, then collect what is left.",
}
