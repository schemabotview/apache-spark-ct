import type { Scene } from '@graphlearning/flow'

// §8.7 — retry and speculation settings from the 4.0.1 configuration page, and what a second attempt
// of one task does to a file write versus a direct external side effect.
export const retrySideEffects: Scene = {
  id: 'retry-side-effects',
  title: 'Retries and side effects',
  flow: 'TB',
  nodes: [
    {
      id: 'retry-conf',
      kind: 'code',
      filename: 'defaults in 4.0.1',
      label: `spark.task.maxFailures              4
spark.stage.maxConsecutiveAttempts  4
spark.speculation                   false
spark.speculation.multiplier        3
spark.speculation.quantile          0.9`,
    },
    {
      id: 'attempt-table',
      kind: 'table',
      label: 'Task 12 dies, attempt 1 succeeds',
      sub: 'partition of 3 orders: o1 o2 o3',
      headers: ['output', 'attempt 0', 'final result'],
      values: [
        ['df.write.parquet', 'never committed', '3 rows'],
        ['POST per row', 'sent o1, o2', '5 calls'],
        ['POST with order id key', 'sent o1, o2', '3 effects'],
      ],
    },
  ],
  edges: [],
}
