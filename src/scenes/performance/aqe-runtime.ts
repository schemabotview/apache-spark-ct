import type { Scene } from '@graphlearning/flow'

// §6.10 — adaptive query execution changing a plan with runtime statistics: a filtered customer table
// estimated large (no CBO, so the filter does not shrink the estimate) and actually tiny. Real
// initial and final join operators from 4.0.1; medians of 3 on local[4].
export const aqeRuntime: Scene = {
  id: 'aqe-runtime',
  title: 'AQE re-plans at runtime',
  flow: 'TB',
  nodes: [
    {
      id: 'aqe-code',
      kind: 'code',
      filename: 'aqe.py',
      label: `small = customers.where(
    (F.col("segment") == 0) & (F.col("customer_id") < 1000))
orders.join(small, "customer_id") \\
      .groupBy("segment").agg(F.count("*"))
# initial plan:  SortMergeJoin   (estimate: 11 MB)
# final plan:    BroadcastHashJoin (actual: tiny)`,
    },
    {
      id: 'aqe-table',
      kind: 'table',
      label: 'What AQE changed in this chapter',
      sub: 'spark.sql.adaptive.enabled',
      headers: ['re-optimisation', 'AQE off', 'AQE on'],
      values: [
        ['switch join strategy', 'SortMergeJoin, 1.35 s', 'BroadcastHashJoin, 0.26 s'],
        ['coalesce partitions', '200 tasks, 1.31 s', '1 task, 0.77 s'],
        ['split skewed partitions', '4 tasks, max 1,895 ms', '9 tasks, max 624 ms (8MB threshold)'],
      ],
    },
  ],
  edges: [{ source: 'aqe-code', target: 'aqe-table' }],
}
