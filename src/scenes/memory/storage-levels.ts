import type { Scene } from '@graphlearning/flow'

export const storageLevels: Scene = {
  id: 'mem-storage-levels',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'The storage levels, and when each is the right answer',
      sub: 'three independent choices — memory or disk, deserialized or serialized, replicated or not',
      headers: ['Level', 'What it does', 'Use when'],
      values: [
        ['MEMORY_ONLY', 'objects in memory; drops whole partitions that do not fit', 'the RDD default — rarely what you want'],
        ['MEMORY_AND_DISK', 'memory first, the rest serialized to disk', 'the DataFrame default, and the safe answer'],
        ['MEMORY_ONLY_SER', 'serialized in memory — smaller, CPU to decode', 'memory-bound and you can spare CPU'],
        ['DISK_ONLY', 'serialized on disk, always', 'recomputation costs more than a disk read'],
        ['..._2', 'any level, replicated to a second node', 'losing it would cost a very long recompute'],
        ['OFF_HEAP', 'outside the JVM heap, in Tungsten memory', 'GC pauses are the measured problem'],
      ],
    },
    {
      id: 'note',
      label: 'The _SER trade',
      pattern: 'network',
      icon: 'scale',
      sub: 'compact, but CPU to decode on every single read',
    },
  ],
  edges: [{ source: 'table', target: 'note' }],
}
