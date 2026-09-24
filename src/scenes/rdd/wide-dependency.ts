import type { Scene } from '@graphlearning/flow'

export const wideDependency: Scene = {
  id: 'rdd-wide',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'shape',
      label: 'Wide — an output partition needs rows from many inputs',
      pattern: 'group',
      sub: 'groupByKey · reduceByKey · join · distinct · sortBy — every input can contribute to every output',
      cols: 2,
      children: [
        { id: 'w-in', label: 'every input partition', pattern: 'storage', sub: 'holds a bit of every key' },
        { id: 'w-out', label: 'every output partition', pattern: 'warn', sub: 'needs a bit from every input' },
      ],
      edges: [{ source: 'w-in', target: 'w-out' }],
    },
    {
      id: 'costs',
      label: 'Everything narrow gave you, taken back',
      pattern: 'group',
      sub: 'one wide dependency undoes all three gifts at once — which is why the count of them is the cost of the job',
      cols: 3,
      children: [
        { id: 'c-pipe', label: 'pipelining ends', pattern: 'warn', sub: 'a stage boundary, here' },
        { id: 'c-net', label: 'the network', pattern: 'warn', sub: 'written to disk, then fetched' },
        { id: 'c-redo', label: 'recovery is costly', pattern: 'warn', sub: 'one lost partition, MANY parents' },
      ],
    },
  ],
  edges: [{ source: 'shape', target: 'costs' }],
}
