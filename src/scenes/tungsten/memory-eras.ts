import type { Scene } from '@graphlearning/flow'

export const memoryEras: Scene = {
  id: 'tun-memory-eras',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'static',
      label: 'Spark 1.x — two fixed pools, and a wall between them',
      pattern: 'group',
      sub: 'you set the fractions in advance; an idle storage pool could not help a starving shuffle',
      flow: 'LR',
      children: [
        { id: 's-store', label: 'storage: 60%', pattern: 'warn', sub: 'cached data · fixed' },
        { id: 's-shuffle', label: 'shuffle: 20%', pattern: 'warn', sub: 'joins and sorts · fixed' },
      ],
    },
    {
      id: 'unified',
      label: 'Spark 1.6+ — one pool, a soft boundary, a borrow rule',
      pattern: 'group',
      sub: 'spark.memory.fraction (0.6) is the pool; storageFraction (0.5) is only the floor storage can defend',
      cols: 2,
      children: [
        { id: 'u-exec', label: 'execution can evict storage', pattern: 'service', sub: 'down to the floor' },
        { id: 'u-store', label: 'storage cannot evict', pattern: 'warn', sub: 'execution is protected — its work is lost' },
      ],
    },
    {
      id: 'now',
      label: '"My cache disappeared"',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'a big join took the memory back — as designed',
    },
  ],
  edges: [
    { source: 'static', target: 'unified', label: 'let them share' },
    { source: 'unified', target: 'now' },
  ],
}
