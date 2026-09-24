import type { Scene } from '@graphlearning/flow'

export const whatEvictionDoes: Scene = {
  id: 'mem-eviction',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'lru',
      label: 'Eviction is LRU, and it works on whole partitions',
      pattern: 'group',
      sub: 'a partition is never half-cached — the unit that arrives is the unit that leaves',
      cols: 2,
      children: [
        { id: 'l-unit', label: 'the unit is a partition', pattern: 'network', sub: 'not a row, not a block of rows' },
        { id: 'l-order', label: 'least recently used first', pattern: 'network', sub: 'across everything cached' },
      ],
    },
    {
      id: 'after',
      label: 'And what happens next depends entirely on the level',
      pattern: 'group',
      sub: 'this is the whole practical difference between the two defaults from the last section',
      cols: 2,
      children: [
        { id: 'a-mem', label: 'MEMORY_ONLY → recomputed', pattern: 'warn', sub: 'the lineage runs again, silently' },
        { id: 'a-disk', label: 'MEMORY_AND_DISK → read back', pattern: 'service', sub: 'slower than memory, far faster than redoing it' },
      ],
    },
    {
      id: 'worst',
      label: 'The thrash',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'too big to fit → evict, recompute, evict, recompute',
    },
  ],
  edges: [
    { source: 'lru', target: 'after' },
    { source: 'after', target: 'worst' },
  ],
}
