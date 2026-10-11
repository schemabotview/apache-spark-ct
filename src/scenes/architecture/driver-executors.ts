import type { Scene } from '@graphlearning/flow'

// §2.2 — the three roles of a running application. The driver holds the session and context and
// schedules; the cluster manager only allocates; executors run tasks. One application, its own
// executors — they are not shared with any other application. The cluster manager sits beside the
// executors rather than between them: an edge spanning two layers was routed straight through it.
export const driverExecutors: Scene = {
  id: 'driver-executors',
  title: 'Driver, cluster manager, executors',
  flow: 'TB',
  nodes: [
    {
      id: 'driver-process',
      label: 'Driver',
      sub: 'plans and schedules',
      pattern: 'service',
      cols: 1,
      children: [
        { id: 'user-program', label: 'Your program', sub: 'daily_sales.py', icon: 'filecode' },
        { id: 'spark-session', label: 'SparkSession', sub: 'entry point to the APIs', icon: 'dooropen' },
        { id: 'spark-context', label: 'SparkContext', sub: 'connects to the cluster', icon: 'plug' },
      ],
    },
    { id: 'cluster-manager', label: 'Cluster manager', sub: 'standalone, YARN or Kubernetes', pattern: 'external', icon: 'building' },
    {
      id: 'executor-pool',
      label: 'Executors',
      sub: 'this application only',
      pattern: 'storage',
      cols: 1,
      children: [
        { id: 'executor-1', label: 'Executor 1', sub: '4 task slots', icon: 'cpu' },
        { id: 'executor-2', label: 'Executor 2', sub: '4 task slots', icon: 'cpu' },
        { id: 'executor-3', label: 'Executor 3', sub: '4 task slots', icon: 'cpu' },
      ],
    },
  ],
  edges: [
    { source: 'driver-process', target: 'cluster-manager', label: 'request executors' },
    { source: 'driver-process', target: 'executor-pool', label: 'tasks and results', bidirectional: true },
  ],
}
