import type { Scene } from '@graphlearning/flow'

export const dagScheduler: Scene = {
  id: 'exec-dag-scheduler',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'dag',
      label: 'DAG scheduler',
      pattern: 'service',
      sub: 'thinks in stages · knows the shape of the plan',
      cols: 1,
      children: [
        { id: 'd-cut', label: 'cuts stages', pattern: 'network', sub: 'at every shuffle' },
        { id: 'd-order', label: 'orders them', pattern: 'network', sub: 'by what depends on what' },
        { id: 'd-skip', label: 'skips finished ones', pattern: 'network', sub: 'shuffle files still on disk' },
      ],
    },
    {
      id: 'task',
      label: 'Task scheduler',
      pattern: 'service',
      sub: 'thinks in tasks · knows where the slots are',
      cols: 1,
      children: [
        { id: 'ts-place', label: 'places tasks', pattern: 'network', sub: 'preferring local data' },
        { id: 'ts-retry', label: 'retries failures', pattern: 'network', sub: 'up to four times' },
        { id: 'ts-spec', label: 'launches speculation', pattern: 'network', sub: 'against stragglers' },
      ],
    },
    {
      id: 'lost',
      label: 'When a shuffle file is lost',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'FetchFailed → the MAP STAGE is resubmitted, not the task',
    },
  ],
  edges: [
    { source: 'dag', target: 'task', label: 'here is a stage: run these tasks' },
    { source: 'task', target: 'lost' },
  ],
}
