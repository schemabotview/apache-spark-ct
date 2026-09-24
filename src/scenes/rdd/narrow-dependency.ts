import type { Scene } from '@graphlearning/flow'

export const narrowDependency: Scene = {
  id: 'rdd-narrow',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'shape',
      label: 'Narrow — each output partition reads exactly one input',
      pattern: 'group',
      sub: 'map · filter · flatMap · mapPartitions · union — no row ever needs to know about another partition',
      cols: 3,
      children: [
        { id: 'n-a', label: 'partition 0 → 0′', pattern: 'service', sub: 'host A, start to finish' },
        { id: 'n-b', label: 'partition 1 → 1′', pattern: 'service', sub: 'host B, start to finish' },
        { id: 'n-c', label: 'partition 2 → 2′', pattern: 'service', sub: 'host C, start to finish' },
      ],
    },
    {
      id: 'gifts',
      label: 'Three things this buys, all at once',
      pattern: 'group',
      sub: 'the reason Spark works hard to keep a run of operations narrow for as long as it can',
      cols: 3,
      children: [
        { id: 'g-pipe', label: 'pipelining', pattern: 'network', sub: 'ten narrow steps, one pass over the rows' },
        { id: 'g-local', label: 'no network', pattern: 'network', sub: 'the work happens where the data is' },
        { id: 'g-cheap', label: 'cheap recovery', pattern: 'network', sub: 'one lost partition, one parent to redo' },
      ],
    },
  ],
  edges: [{ source: 'shape', target: 'gifts' }],
}
