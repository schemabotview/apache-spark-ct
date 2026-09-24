import type { Scene } from '@graphlearning/flow'

// §4 the-exchange — the ownership question. Shuffle files are written by executors but they are NOT
// the executor's private state: the reduce side comes back for them later, possibly after the writer
// is gone. Drawn as three executor groups each nesting its own JVM and its own disk, with the
// external shuffle service sitting beside them as the thing that serves those files when the JVM
// is not there to. The dead executor is the whole argument, so it is drawn dead (`warn`, greyed by
// its sub) while its disk still answers.
export const exchange: Scene = {
  id: 'shuffle-exchange',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'writers',
      label: 'The map side, after Stage 0 finished',
      pattern: 'group',
      sub: 'shuffle output lives on the disk of the node that produced it — it was never sent anywhere',
      children: [
        {
          id: 'exec-a',
          label: 'Executor A',
          pattern: 'service',
          cols: 2,
          children: [
            { id: 'jvm-a', label: 'JVM', pattern: 'network', sub: 'idle', variant: 'tile' },
            { id: 'disk-a', label: 'disk', pattern: 'storage', sub: '.data + .index', variant: 'tile' },
          ],
        },
        {
          id: 'exec-b',
          label: 'Executor B',
          pattern: 'service',
          cols: 2,
          children: [
            { id: 'jvm-b', label: 'JVM', pattern: 'network', sub: 'idle', variant: 'tile' },
            { id: 'disk-b', label: 'disk', pattern: 'storage', sub: '.data + .index', variant: 'tile' },
          ],
        },
        {
          id: 'exec-c',
          label: 'Executor C — killed',
          pattern: 'warn',
          sub: 'dynamic allocation gave it back · spot instance reclaimed · it crashed',
          cols: 2,
          children: [
            { id: 'jvm-c', label: 'JVM', pattern: 'warn', sub: 'gone', variant: 'tile' },
            { id: 'disk-c', label: 'disk', pattern: 'storage', sub: 'files still there', variant: 'tile' },
          ],
        },
      ],
    },
    {
      id: 'ess',
      label: 'External shuffle service',
      pattern: 'service',
      icon: 'server',
      sub: 'one per node · outlives the JVM',
    },
    {
      id: 'readers',
      label: 'The reduce side, Stage 1',
      pattern: 'group',
      sub: 'task k asks every node for its slice k — N writers × M readers connections',
      cols: 2,
      children: [
        { id: 'r-0', label: 'reduce task 0', pattern: 'network', sub: 'wants slice 0 from A, B and C' },
        { id: 'r-1', label: 'reduce task 1', pattern: 'network', sub: 'wants slice 1 from A, B and C' },
      ],
    },
  ],
  edges: [
    { source: 'writers', target: 'ess', label: 'reads local disk' },
    { source: 'ess', target: 'readers', label: 'fetch' },
  ],
}
