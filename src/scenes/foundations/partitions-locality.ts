import type { Scene } from '@graphlearning/flow'

// §1.3 — one logical dataset split into partitions across three machines. Each machine sums the
// partitions it already holds (locality), and only the small partial totals cross the network to be
// combined. Partitions are chips because they are counted, not described.
export const partitionsLocality: Scene = {
  id: 'partitions-locality',
  title: 'Partitions, computed where they live',
  flow: 'TB',
  nodes: [
    { id: 'order-dataset', label: 'Order events', sub: 'one logical dataset', pattern: 'storage', icon: 'database' },
    {
      id: 'three-machines',
      label: 'Three machines',
      pattern: 'group',
      cols: 3,
      children: [
        {
          id: 'machine-a',
          label: 'Machine A',
          sub: 'sums its own partitions',
          pattern: 'service',
          cols: 2,
          children: [
            { id: 'part-1', label: 'P1', variant: 'chip' },
            { id: 'part-2', label: 'P2', variant: 'chip' },
          ],
        },
        {
          id: 'machine-b',
          label: 'Machine B',
          sub: 'sums its own partitions',
          pattern: 'service',
          cols: 2,
          children: [
            { id: 'part-3', label: 'P3', variant: 'chip' },
            { id: 'part-4', label: 'P4', variant: 'chip' },
          ],
        },
        {
          id: 'machine-c',
          label: 'Machine C',
          sub: 'sums its own partitions',
          pattern: 'service',
          cols: 2,
          children: [
            { id: 'part-5', label: 'P5', variant: 'chip' },
            { id: 'part-6', label: 'P6', variant: 'chip' },
          ],
        },
      ],
    },
    { id: 'combine-totals', label: 'Combine', sub: 'small totals only', pattern: 'network', icon: 'merge' },
  ],
  edges: [
    { source: 'order-dataset', target: 'three-machines', label: 'split into partitions' },
    { source: 'machine-a', target: 'combine-totals' },
    { source: 'machine-b', target: 'combine-totals', label: 'partial sums' },
    { source: 'machine-c', target: 'combine-totals' },
  ],
}
