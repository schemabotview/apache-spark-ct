import type { Scene } from '@graphlearning/flow'

export const lineage: Scene = {
  id: 'rdd-lineage',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'graph',
      label: 'The lineage graph — every RDD knows its parents',
      pattern: 'group',
      sub: 'built on the driver as you write transformations, all the way back to something durable on disk',
      flow: 'LR',
      children: [
        { id: 'l-file', label: 'the file', pattern: 'storage', sub: 'durable — the root' },
        { id: 'l-1', label: 'filtered', pattern: 'service', sub: 'narrow' },
        { id: 'l-2', label: 'mapped', pattern: 'service', sub: 'narrow' },
        { id: 'l-3', label: 'grouped', pattern: 'warn', sub: 'wide' },
      ],
      edges: [
        { source: 'l-file', target: 'l-1' },
        { source: 'l-1', target: 'l-2' },
        { source: 'l-2', target: 'l-3' },
      ],
    },
    {
      id: 'loss',
      label: 'A machine dies',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'no replica exists — and none is needed',
    },
    {
      id: 'recover',
      label: 'The recovery, which is just the graph read backwards',
      pattern: 'group',
      sub: 'only the lost partition is rebuilt — not the RDD, not the stage, not the job',
      cols: 3,
      children: [
        { id: 'r-which', label: 'which parents fed it', pattern: 'network', sub: 'the graph already says' },
        { id: 'r-redo', label: 'redo that path', pattern: 'network', sub: 'for that one partition' },
        { id: 'r-done', label: 'carry on', pattern: 'service', sub: 'slower, not failed' },
      ],
    },
  ],
  edges: [
    { source: 'graph', target: 'loss' },
    { source: 'loss', target: 'recover', label: 'the plan IS the backup' },
  ],
}
