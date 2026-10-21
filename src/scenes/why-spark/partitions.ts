import type { Scene, SceneNode } from '@graphlearning/flow'

// One day (~200 GB) cut into 128 MB pieces — Spark's default spark.sql.files.maxPartitionBytes — so
// ≈ 1,600 partitions, spread over the machines that store them. Each machine sums its own pieces;
// only the small partial results travel.
const chip = (id: string, label: string): SceneNode => ({ id, label, variant: 'chip', pattern: 'storage', icon: 'none' })
const machine = (n: number, parts: string[]): SceneNode => ({
  id: `node-${n}`,
  label: `Machine ${n}`,
  sub: 'stores its partitions, and runs the code on them',
  pattern: 'storage',
  icon: 'server',
  cols: 3,
  children: [
    ...parts.map((p) => chip(`p-${n}-${p}`, `part ${p}`)),
    { id: `sum-${n}`, label: 'partial sum', sub: 'computed where the data is', icon: 'sigma', pattern: 'service', span: 'all' },
  ],
})

export const partitions: Scene = {
  id: 'partitions-locality',
  framed: true,
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'row',
      label: 'Split, compute where it lives, combine',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'day',
          kind: 'list',
          icon: 'database',
          label: 'One day of events',
          sub: '~200 GB',
          pattern: 'storage',
          items: [
            'Cut into 128 MB partitions',
            '200 GB ÷ 128 MB ≈ 1,600 of them',
            'A partition is the unit of work',
            'Each is stored on some machine',
          ],
        },
        { id: 'cluster', label: 'The cluster', bare: true, cols: 3, children: [machine(1, ['1', '4', '7']), machine(2, ['2', '5', '8']), machine(3, ['3', '6', '9'])] },
        { id: 'combine', label: 'Combine', sub: 'only the partial sums cross the network', icon: 'merge', pattern: 'service' },
      ],
      edges: [
        { source: 'day', target: 'cluster', label: 'split' },
        { source: 'cluster', target: 'combine', label: 'small results' },
      ],
    },
    {
      id: 'below',
      label: 'Locality',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'locality',
          kind: 'table',
          label: 'Locality: where a task reads its partition from',
          headers: ['level', 'the data is', 'cost'],
          values: [
            ['PROCESS_LOCAL', 'in the same process', 'none'],
            ['NODE_LOCAL', 'on the same machine', 'a disk read'],
            ['RACK_LOCAL', 'on the same rack', 'one network hop'],
            ['ANY', 'anywhere in the cluster', 'across the network'],
          ],
        },
        {
          id: 'rules',
          kind: 'list',
          icon: 'share',
          label: 'Move as little as possible',
          pattern: 'service',
          items: [
            'Move the code to the data: a function is kilobytes, a partition 128 MB',
            'Make data small before it moves: partial sums, not rows',
            'Some work needs rows together — every Leeds order in one place',
            'That movement is a shuffle, and it is where jobs spend their time',
          ],
        },
      ],
    },
  ],
  edges: [],
}
