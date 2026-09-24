import type { Section } from '../types'

export const strategySwitch: Section = {
  id: 'strategy-switch',
  title: 'Switching the join, mid-flight',
  scene: 'aqe-strategy-switch',
  focus: 'switch',
  slide: `## Switching the join

**Planned** as a sort-merge join, because the right side *estimated* at 4 GB — no statistics, a filter of unknown selectivity.

**Then the stage ran**, and it measured **3 MB**.

| | |
|---|---|
| Estimated | 4 GB — a guess built on a guess |
| Actual | **3 MB** — counted, from the shuffle files |

### So it switches
\`\`\`
SortMergeJoin  →  BroadcastHashJoin
\`\`\`

The sort disappears. The second shuffle disappears. A *local shuffle reader* avoids re-reading data that's already sitting on the right executors.

### Why the estimate was so wrong
This isn't an exceptional case. Filter selectivity is genuinely hard to estimate, and Parquet's compression makes on-disk size a poor proxy for in-memory size. **Being off by three orders of magnitude is ordinary.**

> Which is why this particular re-plan pays for AQE on its own.`,
  narration:
    "The second thing AQE does is the one with the largest single payoff. Here's the setup. Spark plans a join between two tables. The right side has no statistics — maybe it's the result of a filter, maybe nobody ever ran ANALYZE TABLE — so the optimizer estimates it at four gigabytes, which is well over the broadcast threshold. It plans a sort-merge join: shuffle both sides, sort both sides, merge. Expensive, but the right call for two large tables. Then the stage producing that right side actually runs. And it produces three megabytes. Not four gigabytes — three megabytes, measured from the shuffle files. The estimate was off by three orders of magnitude. Without AQE, nothing can be done: the plan says sort-merge, so you shuffle and sort a table small enough to fit in a browser tab. With AQE, Spark sees the real size at the stage boundary and switches to a broadcast hash join. The sort disappears entirely. The second shuffle disappears. And there's a nice detail: a local shuffle reader lets it avoid re-reading data that's already sitting on the right executors. Now, why was the estimate so catastrophically wrong? This is worth saying plainly, because it sounds like an edge case and isn't. Filter selectivity is genuinely hard to estimate — how many rows survive a condition depends on the data, and the optimizer has a heuristic, not knowledge. And Parquet's compression means on-disk size is a poor proxy for in-memory size. Being wrong by orders of magnitude is completely ordinary. This one re-plan justifies adaptive execution on its own.",
}
