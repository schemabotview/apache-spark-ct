import type { Section } from '../types'

export const aqe: Section = {
  id: 'aqe',
  title: 'Adaptive Query Execution: runtime evidence and plan changes',
  scene: 'aqe-runtime',
  focus: 'aqe-table',
  slide: `## Adaptive Query Execution

AQE re-optimises the plan **between query stages**, using statistics from the shuffles that already ran.

### Three re-optimisations, measured
- **Join strategy:** planned \`SortMergeJoin\` from an 11 MB estimate; the filtered side was tiny, so the final plan used \`BroadcastHashJoin\` — **1.35 s → 0.26 s**
- **Coalescing:** 200 shuffle partitions → **1** task, 1.31 s → 0.77 s
- **Skew:** a skewed partition split into 9 tasks — once its threshold was reached

### Reading it
- \`AdaptiveSparkPlan isFinalPlan=false\` before running; **=true** after
- Compare the **final** plan, not the initial one, with the metrics

### The misconception
"The explain() output is the plan that ran." With AQE it is only the **starting** plan.`,
  narration:
    "Adaptive query execution, on by default since Spark three point two, deserves its own look, because it explains several results in this chapter. The optimizer plans from estimates, and estimates can be badly wrong. Here we joined the orders to a filtered customer table, keeping only a few hundred customers. Without cost based statistics, the filter does not shrink the estimate, so Spark still believed the customer side was eleven megabytes and planned a sort merge join. With adaptive execution, Spark ran the customer side first as its own query stage, saw how small it really was, and switched the join to a broadcast hash join. The query went from one point three five seconds to twenty six hundredths. The same mechanism coalesced the aggregation's two hundred shuffle partitions into one task, and, once its threshold was reached, split the skewed partition into nine. All three changes rely on statistics from stages that have already run. That changes how you read plans. Before execution, explain shows adaptive spark plan with is final plan set to false, a starting point. After execution, the final plan shows what actually ran, including the coalesced shuffle reads and the switched join. Compare metrics with the final plan, never the initial one. So the misconception to drop is that explain shows the plan that ran. With adaptive execution on, it shows only the plan Spark started with.",
}
