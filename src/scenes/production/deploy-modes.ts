import type { Scene } from '@graphlearning/flow'

// §8.2 — where the driver runs. Client mode keeps it on the submitting machine, so that machine must
// stay up and near the executors; cluster mode starts it inside the cluster.
export const deployModes: Scene = {
  id: 'deploy-modes',
  title: 'Where the driver runs',
  flow: 'TB',
  nodes: [
    {
      id: 'client-mode',
      label: 'Client mode',
      sub: 'driver on the submitting machine',
      pattern: 'warn',
      cols: 2,
      children: [
        { id: 'client-driver', label: 'Driver', sub: 'edge node or laptop', icon: 'monitor' },
        { id: 'client-executors', label: 'Executors', sub: 'in the cluster', icon: 'server' },
      ],
    },
    {
      id: 'cluster-mode',
      label: 'Cluster mode',
      sub: 'driver inside the cluster',
      pattern: 'service',
      cols: 2,
      children: [
        { id: 'cluster-driver', label: 'Driver', sub: 'container or pod', icon: 'boxes' },
        { id: 'cluster-executors', label: 'Executors', sub: 'same network', icon: 'server' },
      ],
    },
    {
      id: 'placement-table',
      kind: 'table',
      label: 'Choosing a placement',
      headers: ['need', 'client', 'cluster'],
      values: [
        ['interactive, notebooks', 'yes', 'no'],
        ['scheduled production job', 'fragile', 'yes'],
        ['submitter may disconnect', 'job dies', 'job runs'],
        ['driver logs', 'local console', 'cluster logs'],
      ],
    },
  ],
  edges: [],
}
