import type { Scene } from '@graphlearning/flow'

// Course 9's scene file for §§7–11 — the decision, the join types, and the three things you do about
// it. §7 and §11 are where the course stops describing and starts being usable.

// §7 — the selection order. This is a ranked list, so it is drawn as one: each rung names its own
// condition, and the fall-through at the bottom is the answer to "why did I get a cartesian product".
export const howSparkChooses: Scene = {
  id: 'joins-how-spark-chooses',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'equi',
      label: 'An equality to join on?',
      pattern: 'service',
      icon: 'gitbranch',
      sub: 'a = b in the condition — everything below turns on this',
    },
    {
      id: 'ladder',
      label: 'If yes: the first rule that matches wins',
      pattern: 'group',
      sub: 'Spark walks this list in order and stops — it is not choosing the cheapest, it is taking the first that applies',
      children: [
        { id: 'r1', label: '1 · broadcast hash', pattern: 'network', sub: 'a hint, or a side under the threshold' },
        { id: 'r2', label: '2 · shuffle hash', pattern: 'network', sub: 'a hint, or preferSortMergeJoin is off' },
        { id: 'r3', label: '3 · sort-merge', pattern: 'network', sub: 'the keys are sortable — the usual answer' },
      ],
      edges: [
        { source: 'r1', target: 'r2' },
        { source: 'r2', target: 'r3' },
      ],
    },
    {
      id: 'no-equi',
      label: 'If no: the fall-through',
      pattern: 'group',
      sub: 'this is where an accidental cross join comes from — nothing failed, nothing warned',
      cols: 2,
      children: [
        { id: 'n1', label: 'broadcast nested loop', pattern: 'warn', sub: 'if one side is small enough to ship' },
        { id: 'n2', label: 'cartesian product', pattern: 'warn', sub: 'if it is not — every row against every row' },
      ],
    },
  ],
  edges: [
    { source: 'equi', target: 'ladder', label: 'yes' },
    { source: 'equi', target: 'no-equi', label: 'no' },
  ],
}

// §8 — join types, as a table, because the content is a comparison down a fixed set of columns and
// the useful half is the rightmost one: what the type does to the PLAN, not what it does to rows.
export const joinTypes: Scene = {
  id: 'joins-types',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'types',
      kind: 'table',
      pattern: 'service',
      label: 'What the join type costs, beyond what it returns',
      sub: 'the rows it keeps are the part you already know — this is the part that shows up in the plan',
      headers: ['Type', 'Keeps', 'What it does to the plan'],
      values: [
        ['inner', 'matched pairs only', 'the cheapest — the filter can be pushed to both sides'],
        ['left outer', 'all of the left', 'the left side can no longer be filtered by the match'],
        ['full outer', 'all of both', 'rules out broadcast in most cases — both sides must shuffle'],
        ['left semi', 'left rows that match', 'no right columns, so it stops at the first match'],
        ['left anti', 'left rows with no match', 'must scan the whole right side to prove a negative'],
        ['cross', 'every pair', 'no keys, so no partitioning to exploit — see §6'],
      ],
    },
    {
      id: 'note',
      label: 'The underused two',
      pattern: 'network',
      icon: 'lightbulb',
      sub: 'an EXISTS written as an inner join duplicates rows',
    },
  ],
  edges: [{ source: 'types', target: 'note' }],
}

// §9 — bucketing. The idea is a shuffle moved in TIME, so the frame is two timelines: what happens
// every day without it, and what happens once with it.
export const bucketing: Scene = {
  id: 'joins-bucketing',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'without',
      label: 'Without bucketing — every run pays again',
      pattern: 'group',
      sub: 'the same table, shuffled by the same key, every single day',
      flow: 'LR',
      children: [
        { id: 'd1', label: 'Monday', pattern: 'warn', sub: 'shuffle both sides' },
        { id: 'd2', label: 'Tuesday', pattern: 'warn', sub: 'shuffle both sides' },
        { id: 'd3', label: 'Wednesday', pattern: 'warn', sub: 'shuffle both sides' },
      ],
    },
    {
      id: 'with',
      label: 'With bucketing — pay once, at write time',
      pattern: 'group',
      sub: 'bucketBy(320, "customer_id").sortBy("customer_id").saveAsTable(…)',
      flow: 'LR',
      children: [
        { id: 'w0', label: 'write day', pattern: 'service', sub: 'the shuffle happens here, once' },
        { id: 'w1', label: 'Monday', pattern: 'network', sub: 'no Exchange in the plan' },
        { id: 'w2', label: 'every day after', pattern: 'network', sub: 'no Exchange in the plan' },
      ],
    },
    {
      id: 'conditions',
      label: 'The conditions, all of which must hold',
      pattern: 'group',
      sub: 'miss one and you get no error, no warning, and no benefit — just the shuffle you thought you had removed',
      cols: 3,
      children: [
        { id: 'c-col', label: 'same column', pattern: 'warn', sub: 'on both tables' },
        { id: 'c-count', label: 'same bucket count', pattern: 'warn', sub: 'or a multiple, on Spark 3.1+' },
        { id: 'c-table', label: 'a managed table', pattern: 'warn', sub: 'saveAsTable, not a bare path' },
      ],
    },
  ],
  edges: [
    { source: 'without', target: 'with', label: 'move the cost in time' },
    { source: 'with', target: 'conditions' },
  ],
}

// §10 — skewed joins. Salting is the idea people reach for, so it is drawn as the mechanism it is:
// one key becomes many, and the other side is replicated to match. The AQE row is what makes salting
// a last resort rather than a first one on any modern cluster.
export const skewedJoins: Scene = {
  id: 'joins-skewed',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'One key, one task',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: '40% of the orders are one customer — and a stage ends last',
    },
    {
      id: 'aqe',
      label: 'First: let Spark do it',
      pattern: 'group',
      sub: 'spark.sql.adaptive.skewJoin.enabled — it measures the partitions and splits the outliers itself',
      cols: 2,
      children: [
        { id: 'a-factor', label: 'skewedPartitionFactor', pattern: 'service', sub: '5× the median counts as skewed' },
        { id: 'a-size', label: 'thresholdInBytes', pattern: 'service', sub: '256 MB, and both tests must pass' },
      ],
    },
    {
      id: 'salt',
      label: 'Only if that is not enough: salting',
      pattern: 'group',
      sub: 'turn one hot key into n keys by hand — the technique AQE automated, and the reason it rarely earns its complexity now',
      cols: 3,
      children: [
        { id: 's-left', label: 'key → key + rand(0,9)', pattern: 'network', sub: 'the big side: one key becomes ten' },
        { id: 's-right', label: 'explode 0..9', pattern: 'network', sub: 'the small side: each row becomes ten' },
        { id: 's-cost', label: 'the small side ×10', pattern: 'warn', sub: 'and the code is now hard to read' },
      ],
    },
  ],
  edges: [
    { source: 'problem', target: 'aqe' },
    { source: 'aqe', target: 'salt', label: 'still skewed?' },
  ],
}

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
