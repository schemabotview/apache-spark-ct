import type { Scene } from '@graphlearning/flow'

export const coalescePartitions: Scene = {
  id: 'aqe-coalesce',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'before',
      label: 'Before — 200 reduce partitions, because 200 is the default',
      pattern: 'group',
      sub: 'the filter upstream removed 99% of the rows, and nothing downstream was told',
      cols: 4,
      children: [
        { id: 'b-1', label: '8 MB', pattern: 'warn', sub: 'a whole task, for this' },
        { id: 'b-2', label: '7 MB', pattern: 'warn', sub: 'and again' },
        { id: 'b-3', label: '9 MB', pattern: 'warn', sub: 'and again' },
        { id: 'b-4', label: '…197 more', pattern: 'warn', sub: 'scheduling costs more than the work' },
      ],
    },
    {
      id: 'after',
      label: 'After — contiguous partitions merged toward a target size',
      pattern: 'group',
      sub: 'advisoryPartitionSizeInBytes, 64 MB by default — the target, not a guarantee',
      cols: 3,
      children: [
        { id: 'a-1', label: '~64 MB', pattern: 'service', sub: 'eight of them, combined' },
        { id: 'a-2', label: '~64 MB', pattern: 'service', sub: 'eight more' },
        { id: 'a-3', label: '~60 MB', pattern: 'service', sub: 'the remainder' },
      ],
    },
    {
      id: 'why',
      label: 'And the reason this is worth having',
      pattern: 'group',
      sub: 'it makes the old advice obsolete: you no longer size shuffle.partitions for the WHOLE query',
      cols: 2,
      children: [
        { id: 'w-high', label: 'set it high and forget it', pattern: 'service', sub: 'AQE brings it down per stage' },
        { id: 'w-stage', label: 'per stage, not per query', pattern: 'service', sub: 'one number never fitted all of them' },
      ],
    },
  ],
  edges: [
    { source: 'before', target: 'after', label: 'coalesce' },
    { source: 'after', target: 'why' },
  ],
}
