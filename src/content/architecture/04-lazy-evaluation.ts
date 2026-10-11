import type { Section } from '../types'

export const lazyEvaluation: Section = {
  id: 'lazy-evaluation',
  title: 'Transformations, actions and lazy evaluation',
  scene: 'lazy-plan',
  focus: 'actions',
  slide: `## Transformations, actions, laziness

A **transformation** returns a new DataFrame and runs nothing. An **action** asks for a result — only then does Spark plan and run jobs.

### Why lazy
- Spark sees the **whole plan** before choosing how to run it
- Filters and column pruning can move **toward the source**

### Worked trace
- \`where\` and \`groupBy\`: **0 jobs**, just a bigger plan
- \`count()\`: a job reads the input
- \`write\`: **reads it again** — each action recomputes unless cached

### The misconception
"Reading is always lazy." Without a schema, \`spark.read.json\` **scans the input** to infer one, before any action.`,
  narration:
    "Every DataFrame operation falls into one of two kinds. A transformation, such as where, select, group by with an aggregation, or join, returns a new DataFrame and runs nothing at all. It just adds a step to the plan. An action, such as count, show, collect, or write, asks for an actual result, and only at that moment does Spark plan the work and run it. Why design it this way? Because by waiting, Spark sees the whole plan before choosing how to execute it. It can push a filter down toward the data source, and read only the columns the query needs, decisions it could not make one line at a time. Follow the code on the left. After the filter and the grouping, zero jobs have run. Then count is called, and a job reads the input. Then write is called, and here is the surprise for many people: the input is read again. Each action recomputes its plan from the source, unless you explicitly cache an intermediate result, which is a trade-off for a later chapter. One more contrast. It is tempting to say reading is always lazy, but that only holds when Spark already knows the schema. Read JSON without one, and Spark scans the input to infer the columns before you have called any action at all. With a day of order events, that is a full extra pass. This is why our application declares its schema.",
}
