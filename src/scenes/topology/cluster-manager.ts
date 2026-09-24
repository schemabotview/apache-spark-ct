import type { Scene } from '@graphlearning/flow'

export const clusterManager: Scene = {
  id: 'topology-cluster-manager',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'split',
      label: 'Two jobs that sound like one',
      pattern: 'group',
      sub: 'granting resources and scheduling tasks are different problems, solved by different software',
      cols: 2,
      children: [
        { id: 'sp-cm', label: 'the cluster manager', pattern: 'network', sub: 'you may have 8 cores on that box' },
        { id: 'sp-driver', label: 'the driver', pattern: 'service', sub: 'task 14 goes in slot 3, now' },
      ],
    },
    {
      id: 'which',
      label: 'The four, and what each is really for',
      pattern: 'group',
      sub: 'Spark does not care which — the same application runs on all of them unchanged',
      cols: 4,
      children: [
        { id: 'c-standalone', label: 'Standalone', pattern: 'service', sub: 'ships with Spark · one tenant' },
        { id: 'c-yarn', label: 'YARN', pattern: 'service', sub: 'the Hadoop estate' },
        { id: 'c-k8s', label: 'Kubernetes', pattern: 'service', sub: 'the current default' },
        { id: 'c-mesos', label: 'Mesos', pattern: 'warn', sub: 'deprecated — do not start here' },
      ],
    },
    {
      id: 'why',
      label: 'Why separate them',
      pattern: 'network',
      icon: 'layers',
      sub: 'many applications share one cluster, seeing none of the others',
    },
  ],
  edges: [
    { source: 'split', target: 'which' },
    { source: 'which', target: 'why' },
  ],
}
