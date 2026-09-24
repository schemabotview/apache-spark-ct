import type { Scene } from '@graphlearning/flow'

// §1 three-processes — redrawn 2026-09-24. The first version wrote the three interactions as three
// EDGES: driver → cm → executors → driver. That is a cycle, and the engine lays out a DAG, so it
// broke the cycle arbitrarily, linearised the nodes as cluster-manager → executors → driver — the
// reverse of the order the slide introduces them in — and rendered the back-edge as a stub pointing
// at nothing.
//
// The fix is to stop asking a layout engine to draw a cycle. The three PROCESSES are a row, in the
// order the slide names them; the three INTERACTIONS are a separate numbered band underneath, where
// the sequence is carried by the numbers rather than by the geometry. Nothing is lost, the reading
// order matches the narration, and there is no cycle left to break.
export const threeProcesses: Scene = {
  id: 'topology-three-processes',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'processes',
      label: 'A running Spark application is three kinds of process',
      pattern: 'group',
      sub: 'in the order they are introduced — and the division of labour between them is strict',
      cols: 3,
      children: [
        {
          id: 'driver',
          label: '1 · Driver',
          pattern: 'service',
          sub: 'one per application · decides, never works',
          cols: 1,
          children: [
            { id: 'd-plan', label: 'holds the DAG', pattern: 'network', sub: 'the whole plan lives here' },
            { id: 'd-sched', label: 'schedules tasks', pattern: 'network', sub: 'who does what, when' },
            { id: 'd-state', label: 'tracks everything', pattern: 'network', sub: 'which task, which executor' },
          ],
        },
        {
          id: 'cm',
          label: '2 · Cluster manager',
          pattern: 'network',
          sub: 'owns the machines · never sees a task',
          cols: 1,
          children: [
            { id: 'c-grant', label: 'grants containers', pattern: 'service', sub: 'cores and memory, on a node' },
            { id: 'c-blind', label: 'knows no Spark', pattern: 'warn', sub: 'no stages, no tasks, no query' },
          ],
        },
        {
          id: 'executors',
          label: '3 · Executors',
          pattern: 'service',
          sub: 'JVMs · work, never decide',
          cols: 1,
          children: [
            { id: 'x1', label: 'Executor 1', pattern: 'network', sub: '4 cores = 4 task slots' },
            { id: 'x2', label: 'Executor 2', pattern: 'network', sub: '4 cores = 4 task slots' },
            { id: 'x-cache', label: 'and cached data', pattern: 'network', sub: 'held between operations' },
          ],
        },
      ],
    },
    {
      id: 'talk',
      label: 'And the conversation between them, in order',
      pattern: 'group',
      sub: 'a loop, not a line — which is exactly why it is numbered here rather than drawn as arrows',
      cols: 3,
      children: [
        { id: 't-1', label: '1 · driver → manager', pattern: 'network', sub: 'asks for resources' },
        { id: 't-2', label: '2 · manager → executors', pattern: 'network', sub: 'launches them' },
        { id: 't-3', label: '3 · executors → driver', pattern: 'network', sub: 'heartbeats, and results' },
      ],
    },
    {
      id: 'claim',
      label: 'The sentence worth keeping',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'the driver decides and never works; executors do the reverse',
    },
  ],
  edges: [
    { source: 'processes', target: 'talk' },
    { source: 'talk', target: 'claim' },
  ],
}
