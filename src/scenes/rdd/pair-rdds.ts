import type { Scene } from '@graphlearning/flow'

export const pairRdds: Scene = {
  id: 'rdd-pairs',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'shape',
      label: 'Just (key, value) tuples',
      pattern: 'service',
      icon: 'key',
      sub: 'no new type — but the key is what every distributed op needs',
    },
    {
      id: 'unlocks',
      label: 'What having a key unlocks',
      pattern: 'group',
      sub: 'partitioning, grouping and joining are all "put the same key in the same place" — they need a key to exist',
      cols: 3,
      children: [
        { id: 'u-group', label: 'groupByKey', pattern: 'network', sub: 'all values for one key, together' },
        { id: 'u-reduce', label: 'reduceByKey', pattern: 'network', sub: 'combine them as they arrive' },
        { id: 'u-join', label: 'join', pattern: 'network', sub: 'match keys across two collections' },
      ],
    },
    {
      id: 'classic',
      label: 'The oldest optimisation in Spark, and still the clearest',
      pattern: 'group',
      sub: 'both give the same answer; one of them moves a hundredth of the data',
      cols: 2,
      children: [
        { id: 'cl-bad', label: 'groupByKey then sum', pattern: 'warn', sub: 'every row crosses the network' },
        { id: 'cl-good', label: 'reduceByKey', pattern: 'service', sub: 'summed per partition FIRST, then sent' },
      ],
    },
  ],
  edges: [
    { source: 'shape', target: 'unlocks' },
    { source: 'unlocks', target: 'classic' },
  ],
}
