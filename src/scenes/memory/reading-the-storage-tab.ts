import type { Scene } from '@graphlearning/flow'

export const readingTheStorageTab: Scene = {
  id: 'mem-storage-tab',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'The Storage tab, and the Executors tab beside it',
      sub: 'four numbers that between them answer "is my caching doing anything at all"',
      headers: ['What to read', 'Healthy', 'What it means otherwise'],
      values: [
        ['Fraction Cached', '100%', 'below it — partitions are being evicted or were never filled'],
        ['Size in Memory', 'what you expected', 'far larger — deserialized objects are much bigger than the file'],
        ['Size on Disk', 'zero', 'non-zero — it did not fit, and MEMORY_AND_DISK caught it'],
        ['GC Time (Executors)', 'a few % of task time', 'a third — the heap is too full, cache included'],
        ['Nothing listed at all', '—', 'you cached it but never ran an action; cache() is lazy'],
      ],
    },
    {
      id: 'rule',
      label: 'The rule, in one line',
      pattern: 'network',
      icon: 'lightbulb',
      sub: 'expensive, shared, reused — and measured. Else do not.',
    },
  ],
  edges: [{ source: 'table', target: 'rule' }],
}
