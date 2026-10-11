import type { Section } from '../types'

export const partitionsAndTasks: Section = {
  id: 'partitions-and-tasks',
  title: 'Partitions and parallel tasks',
  scene: 'partitions-to-tasks',
  focus: 'task-slots',
  slide: `## Partitions become tasks

Each stage runs **one task per partition**. A task is the unit the scheduler sends to an executor's slot.

### Worked numbers
- 200 GB ÷ **128 MB** (\`spark.sql.files.maxPartitionBytes\`) ≈ **1,600** input partitions
- 50 executors × 4 cores = **200** task slots
- 1,600 tasks ÷ 200 slots = **8 waves**

### What sets parallelism
- At most **one task per slot** runs at once
- Fewer partitions than slots leaves slots **idle**
- Very many tiny partitions add **scheduling overhead** per task

### The misconception
"More executors always help." With 4 partitions, only **4 tasks** run, however big the cluster.`,
  narration:
    "In the first chapter, partitions were a storage idea. Here they become the unit of parallel work. Within a stage, Spark runs exactly one task per partition, and a task is what the driver sends to a free slot on an executor. By default, each executor core is one slot. Let's put the full retail workload through this. When Spark reads files, it packs at most one hundred and twenty eight megabytes into a partition. That is the default for spark dot sql dot files dot max partition bytes. So one day of order events, two hundred gigabytes, becomes roughly sixteen hundred input partitions, and therefore about sixteen hundred tasks in the first stage. Now give the job fifty executors with four cores each. That is two hundred slots, so the sixteen hundred tasks run in about eight waves of two hundred. Two rules fall out of this. At most one task runs per slot at a time, so slots cap the parallelism. And partitions cap it too. If there are fewer partitions than slots, the extra slots sit idle. The opposite extreme costs too: every task carries scheduling overhead, so thousands of tiny partitions spend their time being coordinated rather than computing. That leads to a common misconception: that adding executors always makes a job faster. Picture a stage with only four partitions. It runs four tasks, whether the cluster has four slots or four thousand. The number of partitions is a design decision, and later chapters show how to choose it from evidence.",
}
