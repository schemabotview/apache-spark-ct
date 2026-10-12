import type { Scene } from '@graphlearning/flow'

// §4.7 — orders with an items array of structs and an attrs map. Four orders, but o4's array is
// empty and o5's is NULL: explode keeps 3 rows from 2 orders, explode_outer keeps 5. Real output.
export const nestedData: Scene = {
  id: 'nested-data',
  title: 'Arrays, maps and structs',
  flow: 'TB',
  nodes: [
    {
      id: 'nested-code',
      kind: 'code',
      filename: 'nested.py',
      label: `n.select("order_id", F.size("items"),
         F.col("items.sku"), F.col("attrs")["channel"])
# o1 2 [TEA, MUG] web | o2 1 [CAKE] store
# o4 0 []         web | o5 NULL NULL NULL

lines = n.select("order_id",
                 F.explode("items").alias("item"))
lines.count()             # 3: o4 and o5 vanish
n.select(F.explode_outer("items")).count()  # 5`,
    },
    {
      id: 'nested-results',
      label: 'After explode',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'exploded-lines',
          kind: 'table',
          label: 'one row per line item',
          headers: ['order_id', 'sku', 'qty', 'price', 'line_total'],
          values: [
            ['o1', 'TEA', '2', '5.00', '10.00'],
            ['o1', 'MUG', '1', '30.00', '30.00'],
            ['o2', 'CAKE', '5', '5.00', '25.00'],
          ],
        },
        {
          id: 'explode-join-trap',
          kind: 'code',
          filename: 'trap.py',
          label: `# order-level amount joined after explode
lines.join(order_amounts, "order_id") \\
     .agg(F.sum("amount"))
# 105.0 — the true total is 65.0`,
        },
      ],
    },
  ],
  edges: [{ source: 'nested-code', target: 'nested-results' }],
}
