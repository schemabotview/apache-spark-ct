import type { Section } from '../types'

export const workedPlanAndTrace: Section = {
  id: 'worked-plan-and-trace',
  title: 'Worked case: explain() output and its execution trace',
  scene: 'plan-and-trace',
  focus: 'trace-table',
  slide: `## Worked case: plan meets trace

### One \`collect()\`, three jobs
- **Job 14:** builds the broadcast — 1 task, **50** rows
- **Job 15:** the map stage — **4** tasks, **1,000,000** rows, 200 shuffle records
- **Job 16:** stage 17 **skipped** (its shuffle output already exists); stage 18 reads 200 records in **1** task

### Check it against the plan
- \`BroadcastQueryStage 0\` ↔ job 14; \`ShuffleQueryStage 1\` ↔ job 15
- \`AQEShuffleRead coalesced\` ↔ the single reduce task
- 8 small files were packed into **4** read tasks on \`local[4]\`

**Invariants:** 50 rows · 800,000 completed (80%) · sales 36,364,000.00

### The misconception
"One action, one job." Under AQE, each **query stage** can run as its own job.`,
  narration:
    "Let's finish by putting a plan side by side with what actually happened when it ran. We called collect once, then asked Spark's monitoring API for the jobs and stages it ran. On top is the executed plan, the final version after adaptive execution. Below is the trace. That single collect produced three jobs. Job fourteen built the broadcast: one task that read the fifty store rows. Job fifteen was the map stage: four tasks reading all one million orders and writing two hundred shuffle records. Job sixteen contained two stages. The first was skipped, because its shuffle output already existed from job fifteen, and the second read those two hundred records in a single task. Now match them to the plan. Broadcast query stage zero is job fourteen. Shuffle query stage one is job fifteen. And the coalesced shuffle read explains why the final stage needed only one task. The four read tasks need explaining too. There were eight small Parquet files, and Spark packed them two to a task for four cores. Then check the invariants: fifty rows out, one per store; eight hundred thousand completed orders, eighty percent of the input, as the data was generated; and total sales of thirty six million three hundred and sixty four thousand. The misconception to drop is one action, one job. Under adaptive execution, each query stage can run as a job of its own. Next, we turn this kind of evidence into performance diagnosis.",
}
