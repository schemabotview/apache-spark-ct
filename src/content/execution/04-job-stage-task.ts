import type { Section } from '../types'

export const jobStageTask: Section = {
  id: 'job-stage-task',
  title: 'Job, stage, task, slot',
  scene: 'exec-job-stage-task',
  focus: 'units',
  slide: `## Job, stage, task, slot

Four units. **Each bounded by a different thing** — and being able to name which one you're looking at is most of what reading the Spark UI is.

| Unit | Bounded by |
|---|---|
| **Job** | one action |
| **Stage** | a shuffle |
| **Task** | one partition |
| **Slot** | one core |

### Which means the counts are not yours to choose
- **Jobs = actions.** The only one you control directly.
- **Stages = shuffles + 1.** Count the \`Exchange\`s in \`explain()\`.
- **Tasks = partitions** — *per stage*, not per job. The count changes at every boundary.
- **Slots = executors × cores.** Fixed when the cluster starts.

> "Why does my job have 5 stages?" isn't a mystery. It has four shuffles.`,
  narration:
    "Four words get used constantly in Spark, and they're often used loosely, which makes the UI confusing. Let's pin them down, because each one is bounded by a different thing. A job is bounded by an action. One action, one job. A stage is bounded by a shuffle — a stage runs until data has to move between machines, and then it ends. A task is bounded by a partition. One task processes one partition of one stage. And a slot is bounded by a core. One core runs one task at a time. So the containment goes: a job contains stages, a stage contains tasks, and tasks run in slots. Now here's why this framing is useful rather than just tidy. Three of those four counts are not yours to choose directly. Jobs equal actions — that one you control completely, by choosing how many actions to call. Stages equal shuffles plus one. You don't set that; you cause it, by writing operations that need data to move. Which means the question why does my job have five stages is never a mystery: it has four shuffles, and you can see them in explain before running anything. Tasks equal partitions, and importantly that's per stage, not per job. The count changes at every stage boundary, which is why one stage shows eight tasks and the next shows two hundred. And slots equal executors times cores, fixed when the cluster starts. So when a job is slow, this list tells you where to look. Too many jobs means too many actions. Too many stages means too many shuffles. Too few tasks means not enough parallelism. Too few slots means not enough cluster.",
}
