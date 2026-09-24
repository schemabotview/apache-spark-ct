import type { Scene } from '@graphlearning/flow'

export const whoWins: Scene = {
  id: 'mem-who-wins',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'rule',
      label: 'The borrow rule, and it is not symmetric',
      pattern: 'group',
      sub: 'storageFraction (0.5) is not a reservation — it is only the floor storage is allowed to defend',
      cols: 2,
      children: [
        { id: 'r-exec', label: 'execution evicts storage', pattern: 'service', sub: 'down to the floor, whenever it needs to' },
        { id: 'r-store', label: 'storage never evicts', pattern: 'warn', sub: 'execution is untouchable — it waits or spills' },
      ],
    },
    {
      id: 'why',
      label: 'Why the asymmetry is right',
      pattern: 'group',
      sub: 'one of these two can be rebuilt for free, and the other cannot be rebuilt at all',
      cols: 2,
      children: [
        { id: 'w-cache', label: 'evicted cache', pattern: 'service', sub: 'lineage recomputes it — you lose time' },
        { id: 'w-exec', label: 'evicted execution state', pattern: 'warn', sub: 'mid-shuffle, that work is simply gone' },
      ],
    },
    {
      id: 'so',
      label: 'Protects the unrebuildable',
      pattern: 'service',
      icon: 'shield',
      sub: 'and your cache is the thing it is willing to lose',
    },
  ],
  edges: [
    { source: 'rule', target: 'why' },
    { source: 'why', target: 'so' },
  ],
}
