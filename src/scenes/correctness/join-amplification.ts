import type { Scene } from '@graphlearning/flow'

// §4.4 — six orders joined to a store dimension that lists store 7 twice and has a NULL key. The
// result table is the real row count, sum and distinct-order count for each join, from 4.0.1.
export const joinAmplification: Scene = {
  id: 'join-amplification',
  title: 'Joins that change the row count',
  flow: 'TB',
  nodes: [
    {
      id: 'join-inputs',
      label: 'Inputs',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'orders-in',
          kind: 'table',
          label: 'orders',
          sub: '6 rows, 199.00',
          headers: ['order_id', 'store_id', 'amount'],
          values: [
            ['o1', '7', '40.0'],
            ['o2', '7', '25.0'],
            ['o4', '9', '15.0'],
            ['o5', '12', '80.0'],
            ['o7', '15', '30.0'],
            ['o12', 'NULL', '9.0'],
          ],
        },
        {
          id: 'stores-dup',
          kind: 'table',
          label: 'stores',
          sub: 'store 7 listed twice',
          headers: ['store_id', 'city', 'opened'],
          values: [
            ['7', 'Leeds', '2019'],
            ['7', 'Leeds', '2025'],
            ['9', 'York', '2018'],
            ['12', 'Hull', '2020'],
            ['NULL', 'Unknown', '-'],
          ],
        },
      ],
    },
    {
      id: 'join-results',
      kind: 'table',
      label: 'orders.join(stores, "store_id", how)',
      sub: 'real counts',
      headers: ['how', 'rows', 'sum', 'distinct orders'],
      values: [
        ['inner', '6', '225.0', '4'],
        ['left', '8', '264.0', '6'],
        ['inner, stores deduplicated', '4', '160.0', '4'],
      ],
    },
  ],
  edges: [{ source: 'join-inputs', target: 'join-results' }],
}
