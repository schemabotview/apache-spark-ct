import type { Scene } from '@graphlearning/flow'

// §6.9 — the same 10,000,000 orders in four layouts, each queried with the filter its layout is built
// for. Rows and bytes read are the stage input metrics; medians of 3 on local[4].
export const layoutPruning: Scene = {
  id: 'layout-pruning',
  title: 'Layout decides what gets read',
  flow: 'TB',
  nodes: [
    {
      id: 'layout-code',
      kind: 'code',
      filename: 'layouts.py',
      label: `orders.write.partitionBy("sale_date").parquet(p)
# plan: PartitionFilters: [(sale_date = 2026-10-07)]

orders.repartition(32) \\
      .sortWithinPartitions("status") \\
      .write.parquet(q)
# row-group statistics now separate the statuses`,
    },
    {
      id: 'layout-table',
      kind: 'table',
      label: 'Same data, four layouts',
      sub: 'stage input metrics',
      headers: ['layout', 'filter', 'rows read', 'MB read', 'median'],
      values: [
        ['32 files', 'one sale_date', '10,000,000', '28.2', '0.31 s'],
        ['partitioned by date', 'one sale_date', '333,302', '0.8', '0.12 s'],
        ['32 files', 'status = CANCELLED', '10,000,000', '6.9', '0.31 s'],
        ['sorted by status', 'status = CANCELLED', '1,280,000', '4.8', '0.16 s'],
        ['2,000 small files', 'none (group by store)', '10,000,000', '—', '1.96 s'],
      ],
    },
  ],
  edges: [{ source: 'layout-code', target: 'layout-table' }],
}
