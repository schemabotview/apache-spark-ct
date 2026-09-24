import type { Scene } from '@graphlearning/flow'

export const theDriver: Scene = {
  id: 'topology-driver',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'does',
      label: 'What the driver does, and only the driver',
      pattern: 'group',
      sub: 'your main() runs here — every transformation you write builds a plan in this one process',
      cols: 4,
      children: [
        { id: 'r-plan', label: 'builds the plan', pattern: 'network', sub: 'logical → physical' },
        { id: 'r-split', label: 'cuts it into stages', pattern: 'network', sub: 'at every shuffle' },
        { id: 'r-assign', label: 'assigns tasks', pattern: 'network', sub: 'to free slots, near the data' },
        { id: 'r-collect', label: 'collects results', pattern: 'network', sub: 'and this is the danger' },
      ],
    },
    {
      id: 'single',
      label: 'One process, no backup',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'the driver dies → the whole application dies, executors included',
    },
    {
      id: 'kills',
      label: 'The two ways people kill their own driver',
      pattern: 'group',
      sub: 'both are the same mistake: pulling distributed data into one process that was never sized for it',
      cols: 2,
      children: [
        { id: 'k-collect', label: 'df.collect()', pattern: 'warn', sub: 'every row, into one heap' },
        { id: 'k-broadcast', label: 'a forced broadcast', pattern: 'warn', sub: 'the table is gathered here first' },
      ],
    },
  ],
  edges: [
    { source: 'does', target: 'single' },
    { source: 'single', target: 'kills' },
  ],
}
