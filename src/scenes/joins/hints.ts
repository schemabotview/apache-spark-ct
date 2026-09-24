import type { Scene } from '@graphlearning/flow'

// §11 — hints, as a CODE card: the section's content is the syntax plus the judgement about when
// overriding the optimizer is defensible. House rules for code scenes: lines ≤ 76 cols, ~20 lines.
export const hints: Scene = {
  id: 'joins-hints',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'hints.py',
      minCols: 76,
      label: [
        '# A hint overrides the selection order from the last section.',
        '# It is an instruction, not a suggestion -- Spark will obey it',
        '# even when obeying it is a bad idea.',
        '',
        'from pyspark.sql.functions import broadcast',
        'orders.join(broadcast(customers), "customer_id")',
        '',
        '-- the same four, in SQL',
        'SELECT /*+ BROADCAST(c) */      ...   -- ship c everywhere',
        'SELECT /*+ MERGE(o, c) */       ...   -- force sort-merge',
        'SELECT /*+ SHUFFLE_HASH(c) */   ...   -- build a hash table',
        'SELECT /*+ SHUFFLE_REPLICATE_NL(o, c) */  -- nested loop',
        '',
        '# When a hint is the right call:',
        '#   the table has no statistics, so the estimate is a guess',
        '#   it is small but Spark cannot know that (a UDF, a subquery)',
        '#   you measured both plans and the optimizer picked worse',
        '',
        '# When it is not:',
        '#   "broadcast fixed it once" -- the table grows, the driver dies',
        '#   before trying ANALYZE TABLE ... COMPUTE STATISTICS',
        '#   before turning AQE on, which re-decides with real numbers',
        '',
        '# Check what you actually got, every time:',
        'orders.join(customers, "customer_id").explain()',
        '#   BroadcastHashJoin / SortMergeJoin / ShuffledHashJoin',
      ].join('\n'),
    },
  ],
  edges: [],
}
