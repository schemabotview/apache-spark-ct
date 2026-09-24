import type { Scene } from '@graphlearning/flow'

export const theStageCut: Scene = {
  id: 'exec-stage-cut',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'stage0',
      label: 'Stage 0 — everything narrow, fused into one pass',
      pattern: 'service',
      sub: 'scan, filter, project: no row needs a row from another partition, so none of this needs a boundary',
      flow: 'LR',
      children: [
        { id: 'sc', label: 'FileScan', pattern: 'storage', sub: '4 partitions', variant: 'tile' },
        { id: 'fi', label: 'Filter', pattern: 'network', sub: 'narrow', variant: 'tile' },
        { id: 'pr', label: 'Project', pattern: 'network', sub: 'narrow', variant: 'tile' },
      ],
      edges: [
        { source: 'sc', target: 'fi' },
        { source: 'fi', target: 'pr' },
      ],
    },
    {
      id: 'cut',
      label: 'Exchange',
      pattern: 'warn',
      icon: 'router',
      sub: 'the only thing that ever starts a new stage',
    },
    {
      id: 'stage1',
      label: 'Stage 1 — cannot begin until Stage 0 is entirely done',
      pattern: 'service',
      sub: 'not mostly done. entirely. the slowest task of Stage 0 holds every task of Stage 1',
      flow: 'LR',
      children: [
        { id: 'ag', label: 'HashAggregate', pattern: 'network', sub: 'the groupBy', variant: 'tile' },
        { id: 'wr', label: 'Write', pattern: 'storage', sub: 'or collect', variant: 'tile' },
      ],
      edges: [{ source: 'ag', target: 'wr' }],
    },
  ],
  edges: [
    { source: 'stage0', target: 'cut' },
    { source: 'cut', target: 'stage1' },
  ],
}
