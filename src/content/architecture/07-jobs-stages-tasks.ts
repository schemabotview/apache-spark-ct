import type { Section } from '../types'

export const jobsStagesTasks: Section = {
  id: 'jobs-stages-tasks',
  title: 'From a computation graph to jobs, stages and tasks',
  scene: 'job-stage-task',
  focus: 'stage-zero',
  slide: `## From an action to jobs, stages and tasks

### The rules
- An **action** submits a **job**
- A job splits into **stages** at every **shuffle**
- A stage runs **one task per partition**, each doing the same work

### Worked: the daily summary
- **Stage 0:** scan, filter, partial sum — pipelined, **≈1,600 tasks**
- **Stage 1:** final sum and write — at most **200 tasks**, fewer if AQE coalesces

### Reading the Spark UI
With AQE on (the default), one action can show as **more than one job**, and partition counts can change at runtime. Count stages by **shuffles**, not by lines of code.`,
  narration:
    "Now we can connect everything. When the write is called, the driver turns the plan into a graph of steps and submits a job. The job is divided into stages, and the dividing lines are the shuffles. Everything between two shuffles is narrow, so it can be pipelined, and each stage runs one task per partition, every task doing the same work on a different slice of the data. Apply that to the daily summary. Stage zero scans the order events, keeps the completed ones, and computes partial sums per store, all inside each task, so it runs about sixteen hundred tasks, one per input partition. Then comes the shuffle that the grouping requires. Stage one reads the shuffled partial sums, finishes the totals per store, and writes the Parquet files. It has at most two hundred tasks, the default shuffle partition count, and often fewer, because adaptive query execution can coalesce small partitions once it sees the real data sizes. A warning for when you open the Spark UI. With adaptive execution on, which is the default, a single action can appear as more than one job, and the number of tasks in a stage can differ from what you predicted on paper. So do not count stages by counting lines of code. Count the shuffles. Five lines of narrow transformations are still one stage. One group by is a new one.",
}
