import type { Scene } from '@graphlearning/flow'

export const checkpoint: Scene = {
  id: 'mem-checkpoint',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'cache',
      label: 'cache() keeps the result AND the lineage',
      pattern: 'group',
      sub: 'it has to — if the cache is evicted, the lineage is the only way to get the data back',
      cols: 2,
      children: [
        { id: 'ca-data', label: 'the data, in memory', pattern: 'service', sub: 'and possibly on local disk' },
        { id: 'ca-graph', label: 'the whole graph', pattern: 'warn', sub: 'still hundreds of steps long' },
      ],
    },
    {
      id: 'check',
      label: 'checkpoint() writes to reliable storage and CUTS it',
      pattern: 'group',
      sub: 'setCheckpointDir first · the new lineage is one step: read this file',
      cols: 2,
      children: [
        { id: 'ch-data', label: 'the data, on HDFS or S3', pattern: 'service', sub: 'durable, not local' },
        { id: 'ch-graph', label: 'lineage: truncated', pattern: 'service', sub: 'the graph before it is discarded' },
      ],
    },
    {
      id: 'when',
      label: 'When you actually need it',
      pattern: 'group',
      sub: 'a loop that never ends: 200 iterations means a 200-deep graph the driver has to carry and replay',
      cols: 2,
      children: [
        { id: 'wh-iter', label: 'iterative algorithms', pattern: 'network', sub: 'ML, graph, anything converging' },
        { id: 'wh-stream', label: 'streaming state', pattern: 'network', sub: 'where it is not optional' },
      ],
    },
  ],
  edges: [
    { source: 'cache', target: 'check', label: 'cut the graph' },
    { source: 'check', target: 'when' },
  ],
}
