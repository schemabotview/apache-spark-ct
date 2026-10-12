import type { Scene } from '@graphlearning/flow'

// §6.6 — 10,000,000 orders joined to 1,000,000 customers four ways. The query reads every customer
// column, so the estimate is 11.18 MB (over the 10 MB threshold); medians of 3, local[4].
export const joinChoice: Scene = {
  id: 'join-choice',
  title: 'Choosing a join strategy',
  flow: 'TB',
  nodes: [
    {
      id: 'join-estimates',
      kind: 'code',
      filename: 'size estimates (optimizer stats)',
      label: `customers, all 3 columns    11,180,012 bytes
customers.select("customer_id")  3,726,670
# over 10 MB → sort-merge; under → broadcast
# the same tables join differently depending
# on which columns the query reads`,
    },
    {
      id: 'join-table',
      kind: 'table',
      label: 'orders ⋈ customers, group by segment',
      sub: 'same checksum every row',
      headers: ['strategy', 'how', 'shuffled', 'median'],
      values: [
        ['SortMergeJoin', 'default, AQE off', '130.8 MB', '5.41 s'],
        ['ShuffledHashJoin', 'hint("shuffle_hash")', '130.8 MB', '3.85 s'],
        ['BroadcastHashJoin', 'F.broadcast(customers)', '0', '3.31 s'],
        ['SortMergeJoin', 'default, AQE on', '130.7 MB', '3.50 s'],
      ],
    },
  ],
  edges: [{ source: 'join-estimates', target: 'join-table' }],
}
