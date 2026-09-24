import type { Scene } from '@graphlearning/flow'

export const threeProcesses: Scene = {
  id: 'topology-three-processes',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'driver',
      label: 'Driver',
      pattern: 'service',
      sub: 'one per application · your program runs here',
      cols: 1,
      children: [
        { id: 'd-plan', label: 'holds the DAG', pattern: 'network', sub: 'the whole plan lives here' },
        { id: 'd-sched', label: 'schedules tasks', pattern: 'network', sub: 'decides who does what, when' },
        { id: 'd-state', label: 'tracks everything', pattern: 'network', sub: 'which task, which executor, alive?' },
      ],
    },
    {
      id: 'cm',
      label: 'Cluster manager',
      pattern: 'network',
      icon: 'server',
      sub: 'owns the machines · grants containers · never sees a task',
    },
    {
      id: 'executors',
      label: 'Executors',
      pattern: 'group',
      sub: 'JVMs that run tasks and hold cached data — they do all the work and decide none of it',
      cols: 2,
      children: [
        { id: 'x1', label: 'Executor 1', pattern: 'service', sub: '4 cores = 4 task slots' },
        { id: 'x2', label: 'Executor 2', pattern: 'service', sub: '4 cores = 4 task slots' },
      ],
    },
  ],
  edges: [
    { source: 'driver', target: 'cm', label: 'asks for resources' },
    { source: 'cm', target: 'executors', label: 'launches them' },
    { source: 'executors', target: 'driver', label: 'heartbeats + results' },
  ],
}
