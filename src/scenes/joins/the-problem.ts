import type { Scene } from '@graphlearning/flow'

// §1 — the problem, stated once, in the terms every later section reuses.
export const theProblem: Scene = {
  id: 'joins-the-problem',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'want',
      label: 'What a join asks for',
      pattern: 'group',
      sub: 'orders ⋈ customers on customer_id — every matching pair, wherever the two rows live',
      cols: 2,
      children: [
        { id: 'o-row', label: 'an order row', pattern: 'storage', sub: 'customer_id = 42 · on host A' },
        { id: 'c-row', label: 'its customer row', pattern: 'storage', sub: 'customer_id = 42 · on host D' },
      ],
    },
    {
      id: 'gap',
      label: 'On different machines',
      pattern: 'warn',
      icon: 'router',
      sub: 'and neither host knows the other has a match',
    },
    {
      id: 'options',
      label: 'So exactly one of two things must happen',
      pattern: 'group',
      sub: 'every join strategy in Spark is one of these two answers, and nothing else',
      cols: 2,
      children: [
        { id: 'move-small', label: 'Move one side whole', pattern: 'network', sub: 'copy the small table everywhere' },
        { id: 'move-both', label: 'Move both by key', pattern: 'network', sub: 'repartition so matches land together' },
      ],
    },
  ],
  edges: [
    { source: 'want', target: 'gap' },
    { source: 'gap', target: 'options' },
  ],
}
