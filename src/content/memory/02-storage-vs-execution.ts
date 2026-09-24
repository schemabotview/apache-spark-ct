import type { Section } from '../types'

export const storageVsExecution: Section = {
  id: 'storage-vs-execution',
  title: 'Two uses, one pool',
  scene: 'mem-storage-vs-execution',
  focus: 'one',
  slide: `## Two uses, one pool

The unified pool serves two completely different needs.

### Execution — **transient**
Needed only while an operator runs, then released.
- Shuffle buffers (the map-side sort)
- Join hash tables (the build side)
- Sorts and aggregations accumulating state

### Storage — **durable**
Kept across operations, on purpose.
- Cached partitions
- Broadcast variables

### One pool, a soft boundary
They **share**, and the line between them moves at runtime.

Before Spark 1.6 they were two fixed pools with a wall between them, which meant an idle storage region couldn't help a starving shuffle. You tuned two numbers by hand, per job, and usually got it wrong.

> The sharing is the improvement. The *rule* for sharing is the next section, and it's the part that matters.`,
  narration:
    "That unified pool serves two completely different kinds of need, and keeping them straight explains most of what follows. Execution memory is transient. It's what an operator needs while it's running, and it's released the moment that operator finishes. Shuffle buffers, where the map side accumulates and sorts records before writing them out. Join hash tables, where the build side of a hash join lives. Sorts and aggregations, which accumulate state as rows flow through. All temporary, all scoped to one operation. Storage memory is durable. It's data you've deliberately asked Spark to keep across operations. Cached partitions, from calling cache or persist. And broadcast variables — the small side of a broadcast join sitting there ready to be probed. Those are different enough that you'd expect separate budgets, and historically there were. Before Spark one-point-six, there were two fixed pools with a fixed wall between them. A storage fraction and a shuffle fraction, both set by configuration in advance. And the problem was obvious once you'd hit it: if your job caches nothing at all, a large fraction of your memory sits idle while your shuffle spills to disk for want of it. Two numbers to tune, per job, and you almost always got them wrong. So Spark one-point-six unified them. One pool, and the boundary between execution and storage is soft — it moves at runtime as the two borrow from each other. That's the improvement. But the rule governing how they borrow is not symmetric, and that rule is the single most useful thing in this course.",
}
