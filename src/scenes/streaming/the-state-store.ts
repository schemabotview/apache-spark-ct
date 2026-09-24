import type { Scene } from '@graphlearning/flow'

export const theStateStore: Scene = {
  id: 'str-state-store',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'what',
      label: 'Where a running aggregate actually lives',
      pattern: 'group',
      sub: 'partitioned by the grouping key, versioned per batch, and written to the checkpoint so a restart can resume',
      cols: 2,
      children: [
        { id: 'w-mem', label: 'in the executor', pattern: 'service', sub: 'for speed, during the batch' },
        { id: 'w-ckpt', label: 'and in the checkpoint', pattern: 'service', sub: 'for survival, between them' },
      ],
    },
    {
      id: 'providers',
      label: 'Two providers, and the choice is about size',
      pattern: 'group',
      sub: 'the default keeps the whole state in the JVM heap, which is fine until it is not',
      cols: 2,
      children: [
        { id: 'pr-hdfs', label: 'HDFS-backed (default)', pattern: 'network', sub: 'all in heap · GC pressure grows with state' },
        { id: 'pr-rocks', label: 'RocksDB', pattern: 'service', sub: 'spills to local disk · for large state' },
      ],
    },
    {
      id: 'watch',
      label: 'Watch numRowsTotal',
      pattern: 'warn',
      icon: 'trendingUp',
      sub: 'if it only ever rises, something never expires',
    },
  ],
  edges: [
    { source: 'what', target: 'providers' },
    { source: 'providers', target: 'watch' },
  ],
}
