import type { Scene } from '@graphlearning/flow'

export const onKubernetes: Scene = {
  id: 'topology-kubernetes',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'pods',
      label: 'Everything is a pod',
      pattern: 'group',
      sub: 'spark-submit asks the K8s API server for a driver pod; the driver then requests its own executor pods',
      cols: 2,
      children: [
        { id: 'p-driver', label: 'driver pod', pattern: 'service', sub: 'created first, requests the rest' },
        { id: 'p-exec', label: 'executor pods', pattern: 'service', sub: 'one container each, created on demand' },
      ],
    },
    {
      id: 'dynamic',
      label: 'Dynamic allocation',
      pattern: 'network',
      icon: 'activity',
      sub: 'idle executors are handed back · new ones appear under load',
    },
    {
      id: 'catch',
      label: 'The catch nobody mentions until it bites',
      pattern: 'group',
      sub: 'an executor that goes away takes its shuffle files with it — unless something else is there to serve them',
      cols: 2,
      children: [
        { id: 'ca-shuffle', label: 'shuffle files vanish', pattern: 'warn', sub: 'and the stage is recomputed' },
        { id: 'ca-fix', label: 'so: keep them elsewhere', pattern: 'service', sub: 'a shuffle service, or storage' },
      ],
    },
  ],
  edges: [
    { source: 'pods', target: 'dynamic' },
    { source: 'dynamic', target: 'catch' },
  ],
}
