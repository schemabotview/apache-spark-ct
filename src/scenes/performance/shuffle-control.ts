import type { Scene } from '@graphlearning/flow'

// §6.5 — what repartition and coalesce put in the plan, how many files each wrote, and the
// coalesce(1) / repartition(1) trade measured on 8,000,464 completed rows (local[4]).
export const shuffleControl: Scene = {
  id: 'shuffle-control',
  title: 'repartition versus coalesce',
  flow: 'TB',
  nodes: [
    {
      id: 'repartition-table',
      kind: 'table',
      label: 'Plan node and files written',
      sub: 'orders, then .write.parquet',
      headers: ['call', 'plan', 'files'],
      values: [
        ['repartition(8)', 'Exchange RoundRobinPartitioning(8)', '8'],
        ['coalesce(2)', 'Coalesce 2 — no Exchange', '2'],
        ['repartition("sale_date")', 'Exchange hashpartitioning(sale_date, 200)', '5'],
      ],
    },
    {
      id: 'coalesce-trade',
      kind: 'code',
      filename: 'one output file, two ways',
      label: `completed.coalesce(1)      # 4.73 s
# one stage, ONE task reads all 10M rows

completed.repartition(1)   # 4.76 s
# 4 parallel tasks, then 749 MB shuffled
# into one task`,
    },
  ],
  edges: [],
}
