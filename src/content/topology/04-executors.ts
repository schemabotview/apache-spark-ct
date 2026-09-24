import type { Section } from '../types'

export const executorsSection: Section = {
  id: 'executors',
  title: 'Executors, and why cores are the real unit',
  scene: 'topology-executors',
  focus: 'slots',
  slide: `## Executors

A JVM on a worker node. Two resources: **cores** and **memory**.

### Cores are task slots
One core runs **one task at a time**. So:

\`\`\`
executors × cores per executor = your total parallelism
\`\`\`
20 executors × 5 cores = **100 slots**. That is the maximum number of tasks that can ever run at once, whatever your partition count says.

### Memory is shared by every task in the JVM
Split between **execution** (shuffles, joins, sorts) and **storage** (cached partitions). Eight tasks in one executor are competing for one pool.

### Why very large executors are a trap
| | |
|---|---|
| **One huge JVM** | GC pause time grows with heap size — a 200 GB heap stalls |
| **Many tiny ones** | no sharing: a broadcast table is copied into *every* JVM |

The usual advice is **~5 cores per executor**: enough that tasks share a cached partition and one broadcast copy, few enough to keep GC and I/O throughput sane.`,
  narration:
    "An executor is a JVM process running on a worker node, and it has two resources worth thinking about: cores and memory. Cores first, because this is the one people get wrong. A core is a task slot. One core runs one task at a time. That means your total parallelism is simply the number of executors multiplied by the cores per executor. Twenty executors with five cores each gives you a hundred slots. A hundred tasks can run simultaneously, and not one more — no matter how many partitions your data has. If you've set two hundred shuffle partitions and you have a hundred slots, those tasks run in two waves. That arithmetic explains a lot of confusing Spark UI screens. Memory second. Every executor has a heap, and it's split between two uses: execution memory, which shuffles, joins and sorts consume, and storage memory, which holds cached partitions. The important part is that this is shared across every task in that JVM. If eight tasks are running in one executor, all eight are competing for the same pool. Now, sizing. People's instinct is that fewer, bigger executors must be better — fewer processes, less overhead. But it fails in both directions. One enormous JVM with a two-hundred-gigabyte heap will spend an unpleasant fraction of its life in garbage collection, because GC pause time grows with heap size. Go the other way, one core per executor, and you lose all sharing: a broadcast table gets copied into every single JVM, and cached partitions can't be shared between tasks. The conventional advice is around five cores per executor, and it's a genuine middle: enough tasks to share a cached partition and one broadcast copy, few enough that garbage collection and disk throughput stay reasonable.",
}
