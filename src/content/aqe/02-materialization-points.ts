import type { Section } from '../types'

export const materializationPoints: Section = {
  id: 'materialization-points',
  title: 'A shuffle is where guessing stops being necessary',
  scene: 'aqe-materialization',
  focus: 'known',
  slide: `## Where guessing stops

A stage runs to completion: every task done, every shuffle file written and closed.

**At that instant, these are counts — not estimates:**

| | |
|---|---|
| **Bytes per partition** | all 200 of them, exactly |
| **Rows per partition** | so **skew is now visible** |
| **The real output size** | not the estimate from before |

### Which makes a shuffle the natural place to re-plan
It's already a barrier — everything stops and waits there anyway (that's what a stage boundary *is*). So re-planning costs nothing extra in synchronisation. The data is already materialised and already measured.

AQE calls the piece between two of these a **query stage**.

> Notice what this implies: the re-planning opportunities in your job are exactly your shuffles. No shuffles, no opportunities.`,
  narration:
    "So when, exactly, does Spark know the truth? At a shuffle. Think about what a completed stage means. Every task has finished. Every task has written its shuffle output to local disk and closed the file. And in doing so, every task reported how many bytes and how many rows it wrote, per destination partition. So at the moment a stage completes, Spark has exact figures. Not estimates — counts. It knows how many bytes are in each of the two hundred reduce partitions. It knows the row counts, which means skew is now directly visible rather than assumed away. And it knows the real total output size of that stage, which may be nothing like what the optimizer predicted when it planned the thing. Now, why is a shuffle the natural place to act on that? Because it's already a barrier. The next stage cannot start until this one has completely finished — that's what a stage boundary is. Everything stops and waits there regardless. So inserting a re-planning step costs nothing extra in synchronisation; you're using a pause that was already happening. And the data is already materialised, already written down, already counted. AQE calls the piece of a plan between two of these boundaries a query stage, and query stages are the unit it works in. There's an implication worth drawing out. The opportunities to re-plan your job are exactly your shuffles. If your job has three shuffles, there are three moments where Spark can correct itself. If it has none, there are none, and adaptive execution has nothing to do.",
}
