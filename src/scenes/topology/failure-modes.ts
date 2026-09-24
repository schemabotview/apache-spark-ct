import type { Scene } from '@graphlearning/flow'

export const failureModes: Scene = {
  id: 'topology-failure-modes',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'exec-dies',
      label: 'An executor dies — survivable, by design',
      pattern: 'group',
      sub: 'the driver notices the missing heartbeat, and re-runs that executor’s tasks somewhere else',
      cols: 3,
      children: [
        { id: 'e-detect', label: 'heartbeat stops', pattern: 'network', sub: 'the driver marks it lost' },
        { id: 'e-recompute', label: 'tasks re-run', pattern: 'network', sub: 'lineage says how' },
        { id: 'e-cache', label: 'cached data is gone', pattern: 'warn', sub: 'and is recomputed, not restored' },
      ],
    },
    {
      id: 'driver-dies',
      label: 'The driver dies',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'nothing else holds the plan, so every executor is torn down too',
    },
    {
      id: 'asymmetry',
      label: 'What the asymmetry should change about how you build',
      pattern: 'group',
      sub: 'it is the reason the driver is the process to protect, and the last place to put work',
      cols: 3,
      children: [
        { id: 'a-nowork', label: 'no work on the driver', pattern: 'service', sub: 'no collect() of a big result' },
        { id: 'a-retry', label: 'retry at the job level', pattern: 'service', sub: 'the scheduler restarts it' },
        { id: 'a-idem', label: 'make writes idempotent', pattern: 'service', sub: 'a retry must be safe' },
      ],
    },
  ],
  edges: [
    { source: 'exec-dies', target: 'driver-dies' },
    { source: 'driver-dies', target: 'asymmetry' },
  ],
}
