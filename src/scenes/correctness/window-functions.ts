import type { Scene } from '@graphlearning/flow'

// §4.5 — ranking functions over a store-7 tie (o2 and o6 both 25.0), and the default window frame
// that makes tied rows share a "running" total. Both tables are real 4.0.1 output.
export const windowFunctions: Scene = {
  id: 'window-functions',
  title: 'Window functions and ties',
  flow: 'TB',
  nodes: [
    {
      id: 'window-code',
      kind: 'code',
      filename: 'windows.py',
      label: `w = (Window.partitionBy("store_id")
         .orderBy(F.desc("amount")))
# ties: o2 and o6 are both 25.0
F.row_number().over(w)   # 1, 2, 3 (arbitrary order)
F.rank().over(w)         # 1, 2, 2
F.dense_rank().over(w)   # 1, 2, 2

wd = (Window.partitionBy("store_id")
            .orderBy("amount"))
# default frame is RANGE: tied rows share a total
F.sum("amount").over(wd)`,
    },
    {
      id: 'window-results',
      label: 'Store 7',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'rank-table',
          kind: 'table',
          label: 'Ranking, highest amount first',
          headers: ['order_id', 'amount', 'row_number', 'rank', 'dense_rank'],
          values: [
            ['o1', '40.0', '1', '1', '1'],
            ['o2', '25.0', '2', '2', '2'],
            ['o6', '25.0', '3', '2', '2'],
          ],
        },
        {
          id: 'frame-table',
          kind: 'table',
          label: 'sum over orderBy("amount")',
          headers: ['order_id', 'amount', 'running'],
          values: [
            ['o2', '25.0', '50.0'],
            ['o6', '25.0', '50.0'],
            ['o1', '40.0', '90.0'],
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'window-code', target: 'window-results' }],
}
