import type { Scene } from '@graphlearning/flow'

export const recomputeNotReplicate: Scene = {
  id: 'rdd-recompute',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'hdfs',
      label: 'MapReduce — buy safety with copies',
      pattern: 'group',
      sub: 'write every intermediate result three times, so losing one machine loses nothing',
      cols: 2,
      children: [
        { id: 'h-cost', label: '3× the storage', pattern: 'warn', sub: 'and 3× the write traffic' },
        { id: 'h-when', label: 'paid always', pattern: 'warn', sub: 'even when nothing fails' },
      ],
    },
    {
      id: 'spark',
      label: 'Spark — buy safety with a recipe',
      pattern: 'group',
      sub: 'keep the lineage graph instead of the copies: a few kilobytes on the driver, per job',
      cols: 2,
      children: [
        { id: 's-cost', label: 'nearly free', pattern: 'service', sub: 'a graph, not a dataset' },
        { id: 's-when', label: 'paid on failure', pattern: 'service', sub: 'and only for what was lost' },
      ],
    },
    {
      id: 'condition',
      label: 'The condition',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'every transformation must be deterministic, or recovery lies',
    },
  ],
  edges: [
    { source: 'hdfs', target: 'spark', label: 'trade copies for a graph' },
    { source: 'spark', target: 'condition' },
  ],
}
