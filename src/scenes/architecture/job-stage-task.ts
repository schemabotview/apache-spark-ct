import type { Scene } from '@graphlearning/flow'

// §2.7 — the daily summary's write() as one job of two stages, split at the shuffle the groupBy
// needs. Stage 0 pipelines scan → filter → partial sum inside each of its ~1,600 tasks.
export const jobStageTask: Scene = {
  id: 'job-stage-task',
  title: 'One action, one job, two stages',
  flow: 'TB',
  nodes: [
    { id: 'write-action', label: 'write()', sub: 'the action', pattern: 'user', icon: 'zap' },
    {
      id: 'daily-job',
      label: 'Job 0',
      pattern: 'group',
      flow: 'LR',
      children: [
        {
          id: 'stage-zero',
          label: 'Stage 0',
          sub: '≈1,600 tasks',
          pattern: 'service',
          flow: 'TB',
          children: [
            { id: 'scan-orders', label: 'Scan JSON', sub: 'one partition per task', icon: 'file' },
            { id: 'filter-completed', label: 'Filter', sub: 'completed orders', icon: 'funnel' },
            { id: 'partial-sum', label: 'Partial sum', sub: 'per store, per task', icon: 'sigma' },
          ],
          edges: [
            { source: 'scan-orders', target: 'filter-completed' },
            { source: 'filter-completed', target: 'partial-sum' },
          ],
        },
        {
          id: 'stage-one',
          label: 'Stage 1',
          sub: 'at most 200 tasks',
          pattern: 'network',
          flow: 'TB',
          children: [
            { id: 'final-sum', label: 'Final sum', sub: 'one store per key', icon: 'sigma' },
            { id: 'write-files', label: 'Write', sub: 'Parquet files', icon: 'table' },
          ],
          edges: [{ source: 'final-sum', target: 'write-files' }],
        },
      ],
      edges: [{ source: 'stage-zero', target: 'stage-one', label: 'shuffle' }],
    },
  ],
  edges: [{ source: 'write-action', target: 'daily-job', label: 'submits' }],
}
