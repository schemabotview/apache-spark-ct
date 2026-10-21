import type { Scene, SceneNode } from '@graphlearning/flow'

// Scale up against scale out for the course's fixed workload: a year of events (~70 TB) scanned at
// an assumed 2 GB/s per machine. Neither side's hardware is a quote — the shape of the trade is.
const part = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })
const machine = (id: string, label: string): SceneNode => ({ id, label, variant: 'chip', icon: 'server', pattern: 'network' })

export const scale: Scene = {
  id: 'scale-up-out',
  framed: true,
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'sides',
      label: 'Two ways to grow',
      bare: true,
      flow: 'LR',
      align: 'start',
      stretch: true,
      children: [
    {
      id: 'up',
      label: 'Scale up',
      sub: 'one bigger machine',
      pattern: 'service',
      icon: 'none',
      children: [
        part('up-box', 'One large server', 'more cores, more RAM, faster disks', 'server', 'service'),
        part('up-time', 'A year in ~10 hours', '70 TB at 2 GB/s', 'clock', 'service'),
        {
          id: 'up-list',
          kind: 'list',
          icon: 'scale',
          label: 'What it buys, what it costs',
          pattern: 'service',
          items: [
            'The same program, unchanged — no coordination at all',
            'Price climbs faster than size near the top of the range',
            'There is a largest machine, and data keeps growing',
            'One failure stops the whole run',
          ],
        },
      ],
    },
    {
      id: 'out',
      label: 'Scale out',
      sub: 'many ordinary machines',
      pattern: 'network',
      icon: 'none',
      cols: 5,
      children: [
        machine('m1', 'machine 1'),
        machine('m2', 'machine 2'),
        machine('m3', 'machine 3'),
        machine('m4', '…'),
        machine('m50', 'machine 50'),
        { ...part('out-time', 'A year in ~12 minutes', '1.4 TB each at 2 GB/s, all at once', 'clock', 'network'), span: 'all' },
        {
          id: 'out-list',
          kind: 'list',
          icon: 'network',
          label: 'What it buys, what it costs',
          pattern: 'network',
          span: 'all',
          items: [
            'Capacity grows by adding machines, not replacing one',
            'The program must be split into pieces that run apart',
            'Pieces that need each other’s data cross the network',
            'Machines fail routinely — the system must expect it',
          ],
        },
      ],
    },
      ],
    },
    {
      id: 'verdict',
      kind: 'table',
      label: 'The trade',
      headers: ['', 'up', 'out'],
      values: [
        ['ceiling', 'the largest machine', 'add another'],
        ['cost curve', 'steep at the top', 'roughly linear'],
        ['a failure', 'the run stops', 'redo one piece'],
        ['coordination', 'none', 'network and scheduling'],
        ['the program', 'unchanged', 'split into tasks'],
      ],
    },
  ],
  edges: [],
}
