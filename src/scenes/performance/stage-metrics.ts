import type { Scene } from '@graphlearning/flow'

// §6.2 — the baseline query's stages as the monitoring REST API reported them (the same numbers the
// Spark UI's Stages tab shows), with task-time quantiles from taskSummary.
export const stageMetrics: Scene = {
  id: 'stage-metrics',
  title: 'Where the time went',
  flow: 'TB',
  nodes: [
    {
      id: 'metrics-api',
      kind: 'code',
      filename: 'monitoring REST API',
      label: `GET /api/v1/applications/<app-id>/stages
GET /api/v1/applications/<app-id>/stages/19/0/
    taskSummary?quantiles=0,0.5,1.0
# the same data as the UI's Stages tab`,
    },
    {
      id: 'metrics-table',
      kind: 'table',
      label: 'Baseline query, per stage',
      sub: 'task time min / median / max',
      headers: ['stage', 'tasks', 'input', 'shuffle', 'task time', 'GC', 'min/med/max ms'],
      values: [
        ['18', '1', '50 rows', '–', '6 ms', '0', '6 / 6 / 6'],
        ['19', '4', '10M rows, 34.7 MB', '200 rec out', '3,275 ms', '114 ms', '679 / 841 / 991'],
        ['21', '1', '–', '200 rec in', '8 ms', '0', '8 / 8 / 8'],
      ],
    },
  ],
  edges: [{ source: 'metrics-api', target: 'metrics-table' }],
}
