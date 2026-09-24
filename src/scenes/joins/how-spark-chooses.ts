import type { Scene } from '@graphlearning/flow'

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
