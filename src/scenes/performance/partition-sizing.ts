import type { Scene } from '@graphlearning/flow'

// §6.4 — the same aggregation (1,500 store-day groups) at four shuffle-partition counts with AQE off,
// and AQE's own choice; medians of 3 warm runs on local[4].
export const partitionSizing: Scene = {
  id: 'partition-sizing',
  title: 'How many partitions?',
  flow: 'TB',
  nodes: [
    {
      id: 'sweep-code',
      kind: 'code',
      filename: 'sweep.py',
      label: `spark.conf.set("spark.sql.adaptive.enabled", "false")
for n in [1, 4, 200, 2000]:
    spark.conf.set("spark.sql.shuffle.partitions", n)
    orders.groupBy("store_id", "sale_date") \\
          .agg(F.sum("amount")).collect()`,
    },
    {
      id: 'sweep-table',
      kind: 'table',
      label: '1,500 groups after the shuffle',
      sub: 'median of 3, seconds',
      headers: ['shuffle partitions', 'reduce tasks', 'median'],
      values: [
        ['1', '1', '0.87'],
        ['4', '4', '0.65'],
        ['200 (default)', '200', '1.31'],
        ['2000', '2000', '3.93'],
        ['200, AQE on', '1 after coalescing', '0.77'],
      ],
    },
  ],
  edges: [{ source: 'sweep-code', target: 'sweep-table' }],
}
