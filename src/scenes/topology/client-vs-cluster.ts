import type { Scene } from '@graphlearning/flow'

export const clientVsCluster: Scene = {
  id: 'topology-client-vs-cluster',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'client',
      label: 'Client mode — the driver stays where you typed',
      pattern: 'group',
      sub: 'your laptop or a gateway node is now part of the running job',
      flow: 'LR',
      children: [
        { id: 'cl-you', label: 'your machine', pattern: 'warn', sub: 'the driver lives here' },
        { id: 'cl-cluster', label: 'the cluster', pattern: 'service', sub: 'executors only' },
      ],
    },
    {
      id: 'cluster',
      label: 'Cluster mode — the driver is submitted too',
      pattern: 'group',
      sub: 'the cluster manager launches the driver on a node inside the cluster, then you can walk away',
      flow: 'LR',
      children: [
        { id: 'cx-you', label: 'your machine', pattern: 'network', sub: 'submits, then exits' },
        { id: 'cx-cluster', label: 'the cluster', pattern: 'service', sub: 'driver AND executors' },
      ],
    },
    {
      id: 'choose',
      label: 'How to choose, in one line each',
      pattern: 'group',
      sub: 'the failure question is the decisive one: in client mode, closing your laptop kills the job',
      cols: 2,
      children: [
        { id: 'ch-client', label: 'interactive work', pattern: 'network', sub: 'shells, notebooks — you need the output' },
        { id: 'ch-cluster', label: 'anything scheduled', pattern: 'network', sub: 'survives your laptop, near the executors' },
      ],
    },
  ],
  edges: [
    { source: 'client', target: 'cluster' },
    { source: 'cluster', target: 'choose' },
  ],
}
