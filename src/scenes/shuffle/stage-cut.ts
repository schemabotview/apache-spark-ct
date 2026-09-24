import type { Scene } from '@graphlearning/flow'

// §2 the-stage-cut — the claim is that the shuffle is not an operation INSIDE a stage, it is the
// thing stages are defined by. So the frame is one job, cut once: everything narrow packs into
// Stage 0, the Exchange is drawn as the boundary itself (a `warn` bar between the two groups, not a
// step inside either), and Stage 1 starts on the far side. The task counts are the payload — 4 in,
// 200 out — because that jump is what the next sections spend their time on.
export const stageCut: Scene = {
  id: 'shuffle-stage-cut',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'stage-0',
      label: 'Stage 0',
      pattern: 'service',
      sub: '4 tasks — one per input partition · all of this is pipelined into one pass',
      flow: 'LR',
      children: [
        { id: 'scan', label: 'FileScan', pattern: 'storage', icon: 'database', sub: 'parquet · 4 partitions', variant: 'tile' },
        { id: 'filter', label: 'Filter', pattern: 'network', sub: 'narrow', variant: 'tile' },
        { id: 'project', label: 'Project', pattern: 'network', sub: 'narrow', variant: 'tile' },
      ],
      edges: [
        { source: 'scan', target: 'filter' },
        { source: 'filter', target: 'project' },
      ],
    },
    {
      id: 'exchange',
      label: 'Exchange',
      pattern: 'warn',
      icon: 'router',
      sub: 'hash(user_id) → 200',
    },
    {
      id: 'stage-1',
      label: 'Stage 1',
      pattern: 'service',
      sub: '200 tasks — one per shuffle partition · cannot start until Stage 0 has finished',
      flow: 'LR',
      children: [
        { id: 'agg', label: 'HashAggregate', pattern: 'network', sub: 'the groupBy', variant: 'tile' },
        { id: 'write', label: 'Write', pattern: 'storage', icon: 'database', sub: 'or collect', variant: 'tile' },
      ],
      edges: [{ source: 'agg', target: 'write' }],
    },
  ],
  edges: [
    { source: 'stage-0', target: 'exchange', label: 'each task writes to local disk' },
    { source: 'exchange', target: 'stage-1', label: 'each task fetches its slice' },
  ],
}
