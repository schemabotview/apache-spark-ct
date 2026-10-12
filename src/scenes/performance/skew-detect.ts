import type { Scene } from '@graphlearning/flow'

// §6.7 — the skewed copy of orders (store 7 holds 5,099,631 of 10,000,000 rows) joined to stores with
// broadcasting disabled, then four mitigations. Join-stage task times from taskSummary; local[4].
export const skewDetect: Scene = {
  id: 'skew-detect',
  title: 'Detecting and mitigating skew',
  flow: 'TB',
  nodes: [
    {
      id: 'skew-code',
      kind: 'code',
      filename: 'skew.py',
      label: `orders_skewed.groupBy("store_id").count()
# store 7: 5,099,631 rows (51%)

spark.conf.set(
  "spark.sql.adaptive.skewJoin"
  ".skewedPartitionThresholdInBytes", "8MB")
# default 256MB: not reached on this data`,
    },
    {
      id: 'skew-table',
      kind: 'table',
      label: 'orders_skewed ⋈ stores, by city',
      sub: 'join-stage task ms: min / median / max',
      headers: ['approach', 'tasks', 'min/med/max ms', 'median'],
      values: [
        ['sort-merge, skew handling off', '4', '321 / 901 / 1,895', '3.20 s'],
        ['AQE skew join, 256MB default', '4', '330 / 1,044 / 2,259', '3.18 s'],
        ['AQE skew join, 8MB threshold', '9', '139 / 524 / 624', '2.24 s'],
        ['salting ×8', '5', '144 / 1,758 / 1,911', '3.67 s'],
        ['broadcast stores', 'no join shuffle', '—', '1.04 s'],
      ],
    },
  ],
  edges: [{ source: 'skew-code', target: 'skew-table' }],
}
