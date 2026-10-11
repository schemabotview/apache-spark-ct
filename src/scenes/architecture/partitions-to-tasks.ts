import type { Scene } from '@graphlearning/flow'

// §2.5 — one day of input (200 GB) split at the default 128 MB into about 1,600 partitions, run on
// 200 task slots (50 executors × 4 cores) in 8 waves. Partitions and slots are chips: counted things.
export const partitionsToTasks: Scene = {
  id: 'partitions-to-tasks',
  title: 'Partitions become tasks',
  flow: 'TB',
  nodes: [
    { id: 'day-input', label: '200 GB of JSON', sub: 'one day of order events', pattern: 'storage', icon: 'database' },
    {
      id: 'input-partitions',
      label: '≈1,600 partitions',
      sub: 'up to 128 MB each',
      pattern: 'storage',
      cols: 5,
      children: [
        { id: 'in-part-1', label: 'P1', variant: 'chip' },
        { id: 'in-part-2', label: 'P2', variant: 'chip' },
        { id: 'in-part-3', label: 'P3', variant: 'chip' },
        { id: 'in-part-gap', label: '…', variant: 'chip' },
        { id: 'in-part-last', label: 'P1600', variant: 'chip' },
      ],
    },
    {
      id: 'task-slots',
      label: '200 task slots',
      sub: '50 executors × 4 cores',
      pattern: 'service',
      cols: 4,
      children: [
        { id: 'slots-exec-1', label: 'E1 · 4', variant: 'chip' },
        { id: 'slots-exec-2', label: 'E2 · 4', variant: 'chip' },
        { id: 'slots-exec-gap', label: '…', variant: 'chip' },
        { id: 'slots-exec-last', label: 'E50 · 4', variant: 'chip' },
      ],
    },
  ],
  edges: [
    { source: 'day-input', target: 'input-partitions', label: 'split on read' },
    { source: 'input-partitions', target: 'task-slots', label: '1 task each, 8 waves' },
  ],
}
