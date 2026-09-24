import type { Scene } from '@graphlearning/flow'

export const storageVsExecution: Scene = {
  id: 'mem-storage-vs-execution',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'exec',
      label: 'Execution',
      pattern: 'service',
      sub: 'transient · needed only while an operator runs',
      cols: 1,
      children: [
        { id: 'e-shuffle', label: 'shuffle buffers', pattern: 'network', sub: 'the map-side sort' },
        { id: 'e-join', label: 'join hash tables', pattern: 'network', sub: 'the build side' },
        { id: 'e-sort', label: 'sorts and aggregates', pattern: 'network', sub: 'accumulating state' },
      ],
    },
    {
      id: 'store',
      label: 'Storage',
      pattern: 'service',
      sub: 'durable · kept across operations on purpose',
      cols: 1,
      children: [
        { id: 's-cache', label: 'cached partitions', pattern: 'network', sub: 'what cache() put there' },
        { id: 's-bcast', label: 'broadcast variables', pattern: 'network', sub: 'the small side of a join' },
      ],
    },
    {
      id: 'one',
      label: 'One pool, a soft boundary',
      pattern: 'warn',
      icon: 'gitmerge',
      sub: 'they share, and the line between them moves at runtime',
    },
  ],
  edges: [
    { source: 'exec', target: 'one' },
    { source: 'store', target: 'one' },
  ],
}
