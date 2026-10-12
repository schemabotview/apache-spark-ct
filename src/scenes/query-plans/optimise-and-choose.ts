import type { Scene } from '@graphlearning/flow'

// §5.3 — the optimized logical plan, then the two physical join strategies 4.0.1 chose for the same
// query: broadcast by default (stores is 50 rows), sort-merge with broadcasting disabled. Trimmed:
// expression ids, plan ids and file locations removed; operator names and order are verbatim.
export const optimiseAndChoose: Scene = {
  id: 'optimise-and-choose',
  title: 'Optimisation, then a physical strategy',
  flow: 'TB',
  nodes: [
    {
      id: 'optimized-text',
      kind: 'code',
      filename: 'Optimized Logical Plan',
      label: `Aggregate [city], [city, count(1), sum(amount)]
+- Project [amount, city]
   +- Join Inner, (store_id = store_id)
      :- Project [store_id, amount]
      :  +- Filter (isnotnull(status) AND
      :     (status = COMPLETED) AND isnotnull(store_id))
      :     +- Relation [order_id,store_id,...] parquet
      +- Filter isnotnull(store_id)
         +- Relation [store_id,city] parquet`,
    },
    {
      id: 'join-strategies',
      label: 'Physical join strategy',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'broadcast-join',
          kind: 'code',
          filename: 'default (threshold 10 MB)',
          label: `BroadcastHashJoin [store_id],
  [store_id], Inner, BuildRight
:- Project [store_id, amount]
:  +- Filter ...
:     +- FileScan parquet
+- BroadcastExchange
   +- FileScan parquet
      [store_id,city]`,
        },
        {
          id: 'sort-merge-join',
          kind: 'code',
          filename: 'autoBroadcastJoinThreshold=-1',
          label: `SortMergeJoin [store_id],
  [store_id], Inner
:- Sort [store_id ASC]
:  +- Exchange hashpartitioning(
:       store_id, 200)
+- Sort [store_id ASC]
   +- Exchange hashpartitioning(
        store_id, 200)`,
        },
      ],
    },
  ],
  edges: [{ source: 'optimized-text', target: 'join-strategies' }],
}
