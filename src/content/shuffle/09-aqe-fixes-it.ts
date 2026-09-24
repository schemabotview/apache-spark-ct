import type { Section } from '../types'

export const aqeFixesIt: Section = {
  id: 'aqe-fixes-it',
  title: 'Spark 3 fixes some of this at runtime',
  scene: 'shuffle-aqe-loop',
  focus: 'replan',
  slide: `## Spark 3 fixes some of this at runtime

Everything so far assumed the plan is fixed before the job starts. **Since Spark 3.2 it isn't.**

### Why a shuffle is the right moment
The optimizer estimates. But a completed stage's shuffle files have been **written and measured** — actual bytes and rows per partition. Statistics stop being a guess.

### The loop
\`\`\`
run a stage  →  read its real stats
             →  re-optimize the rest  →  repeat
\`\`\`

| Re-plan | Fires when |
|---|---|
| **Coalesce partitions** | 200 reducers holding 8 MB each → a handful holding ~64 MB |
| **Switch the join** | a side that looked big measures small → broadcast it instead |
| **Split the skew** | one partition dwarfs the rest → cut it up, duplicate its counterpart |

\`spark.sql.adaptive.enabled\` — **on by default since 3.2**

### What it still won't do
A **single hot key** is one partition — it cannot be split. And AQE *right-sizes* a shuffle; it never removes one.`,
  narration:
    "Everything up to this point assumed the plan is decided before the job starts. Since Spark three point two, that's no longer true, and it changes the advice. Here's the insight behind it. Normally the optimizer has to guess — it estimates how big a table is, guesses how many rows survive a filter, and picks a plan from those guesses. Guesses about real data are usually wrong. But there's one moment in every job when the guessing could stop: when a shuffle finishes. At that instant the shuffle files have been written and measured. Spark knows exactly how many bytes and how many rows landed in every single partition. Those aren't estimates any more. So adaptive query execution turns that into a loop. Run a stage. Read what actually happened. Re-run the optimizer on everything that's left, now knowing the truth. Then run the next stage on the improved plan, and repeat at the next shuffle. And it uses that in three ways that map exactly onto problems from earlier in this course. If it finds two hundred reduce partitions each holding eight megabytes, it coalesces them into a handful of sensibly sized ones — that's section six's tuning, done automatically. If a join side it thought was large turns out to be small, it switches to a broadcast join mid-flight — that's section eight, without you asking. And if one partition dwarfs the others, it splits that partition into pieces and duplicates the matching rows from the other side so the results still come out right — that's skew handling. Be clear about the limits, though. A single hot key is one partition, and one partition cannot be split, so a null-heavy column is still your problem. And AQE right-sizes a shuffle. It never removes one.",
}
