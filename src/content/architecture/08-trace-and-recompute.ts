import type { Section } from '../types'

export const traceAndRecompute: Section = {
  id: 'trace-and-recompute',
  title: 'Tracing execution and recomputation',
  scene: 'task-recovery',
  focus: 'rerun-map',
  slide: `## Tracing failure and recomputation

Spark recovers lost work through **lineage**: it knows how every partition was computed, so it can compute it again.

### A failed task
- Retried, up to \`spark.task.maxFailures\` = **4** attempts in a row
- Plain \`local[4]\` makes **one** attempt; \`local[4,2]\` allows two

### A lost executor
- Its **shuffle files** go with it, so Stage 1 hits a fetch failure
- Spark reruns **only the missing** Stage 0 tasks, then retries Stage 1

### The misconception
"A failure restarts the job." Only lost partitions are recomputed — but a task's write to an **external system** can happen twice.`,
  narration:
    "Let's finish by tracing what happens when something goes wrong, because this is where the execution model pays off. Spark does not protect intermediate data by copying it to several machines. Instead, it relies on lineage. For every partition, it knows the chain of steps that produced it, so a lost partition can simply be computed again. Start with a single failed task, say a stage one task that hits a bad disk. The scheduler retries it, on a different executor if it can, and the job only fails if the same task fails four times in a row, the default for spark dot task dot max failures. One caveat: plain local mode gives each task a single attempt. You need a cluster, or the local four comma two form, to see retries. Now a bigger failure. Stage zero has finished, and its tasks have written shuffle files to their executors' local disks. Then executor two disappears, and its shuffle files go with it, unless an external shuffle service was keeping them. Stage one tries to fetch that data and fails. Spark responds by rerunning only the stage zero tasks whose output was lost, then retrying stage one. The job carries on. So a failure does not restart the job. But notice the limit. If a task writes to an external system and is retried, that write can happen twice. Spark's guarantees stop at its own boundary. Next, we turn from execution to the abstractions you write it with: RDDs, DataFrames and SQL.",
}
