import type { Section } from '../types'

export const theTask: Section = {
  id: 'the-task',
  title: 'The task: the unit that fails',
  scene: 'exec-the-task',
  focus: 'retry',
  slide: `## The task

**One task = one partition of one stage.** The smallest thing Spark schedules. It can't be split, moved mid-flight, or run by two cores.

A task is three things: the stage's **code**, serialised and shipped to an executor; **one partition** as its only input; and its **output** — shuffle files, or a result to the driver.

### What happens when one fails
1. It's **retried elsewhere** — lineage says how to redo it
2. \`spark.task.maxFailures\` is **4**. Four strikes and the stage gives up.
3. Then the **job** fails

One partition can end everything. That's the path from a single bad row to a dead job.

### Speculative execution
A straggler is run **again, elsewhere**; the first to finish wins, the other is killed.

> Which means a task can run twice. If it writes to an external system, that write happens twice. Tasks must be idempotent.`,
  narration:
    "A task is one partition of one stage, and it's the smallest thing Spark schedules. It can't be split, it can't be moved once it starts, and two cores can't collaborate on one. Concretely, a task is three things: the code for its stage, serialised and shipped out to an executor; one partition as its only input; and an output, which is either shuffle files written to local disk or a result sent back to the driver. Now, failure, because the task is the unit that fails. When a task fails, Spark doesn't give up. It retries it — possibly on a different executor — and lineage tells it exactly how to redo the work. There's a setting, spark dot task dot maxFailures, defaulting to four. Four failures of the same task and the stage gives up. And when a stage gives up, the job fails. So the path from one bad row to a dead cluster job is quite short: the row breaks a task, the task fails four times because the row is still bad, the stage fails, the job fails. That's worth knowing when you're staring at a job that died after twenty minutes of apparently fine progress. One more behaviour to know about: speculative execution. If Spark notices a task running far slower than its peers, it can launch a second copy of the same task somewhere else and take whichever finishes first, killing the other. It's a defence against a slow machine. But notice the implication — a task can run twice. If your task writes to an external system, that write happens twice. So tasks need to be idempotent, and that's not a theoretical concern; it's the reason a job can mysteriously produce duplicate rows in a database.",
}
