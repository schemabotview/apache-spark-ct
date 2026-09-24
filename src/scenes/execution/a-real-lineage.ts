import type { Scene } from '@graphlearning/flow'

export const aRealLineage: Scene = {
  id: 'exec-real-lineage',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'chain',
      label: 'groupBy → sum → sort → limit → collect, in full',
      pattern: 'group',
      sub: 'one action, two shuffles, three stages — and the task counts change at every boundary',
      children: [
        {
          id: 'st0',
          label: 'Stage 0',
          pattern: 'service',
          sub: '8 tasks — one per input partition',
          flow: 'LR',
          children: [
            { id: 'a-scan', label: 'scan', pattern: 'storage', sub: '8 files', variant: 'tile' },
            { id: 'a-partial', label: 'partial agg', pattern: 'network', sub: 'per partition', variant: 'tile' },
          ],
          edges: [{ source: 'a-scan', target: 'a-partial' }],
        },
        { id: 'ex1', label: 'Exchange · by key', pattern: 'warn', sub: 'the groupBy' },
        {
          id: 'st1',
          label: 'Stage 1',
          pattern: 'service',
          sub: '200 tasks — the shuffle default',
          flow: 'LR',
          children: [
            { id: 'b-final', label: 'final agg', pattern: 'network', sub: 'one row per key', variant: 'tile' },
            { id: 'b-local', label: 'local top 5', pattern: 'network', sub: 'per partition', variant: 'tile' },
          ],
          edges: [{ source: 'b-final', target: 'b-local' }],
        },
        { id: 'ex2', label: 'Exchange · to one', pattern: 'warn', sub: 'the sort + limit' },
        { id: 'st2', label: 'Stage 2', pattern: 'service', sub: '1 task — merge 200 local top-5s, take 5' },
      ],
      edges: [
        { source: 'st0', target: 'ex1' },
        { source: 'ex1', target: 'st1' },
        { source: 'st1', target: 'ex2' },
        { source: 'ex2', target: 'st2' },
      ],
    },
  ],
  edges: [],
}
