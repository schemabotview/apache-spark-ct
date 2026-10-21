import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/04-partitions/project/perf/partitions.py?raw'
import session from '../../../spine/fast/04-partitions/session.txt?raw'

export const partitionSweep: Scene = ideFrame(
  'partition-sweep',
  'retail-pipeline',
  fastTree(4),
  { file: 'perf/partitions.py', code: code, highlight: [7, 9, 11, 12, 13, 14], terminal: session },
  {
    id: 'partition-sweep-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'sweep',
        kind: 'table',
        label: 'What the sweep shows',
        headers: ['partitions', 'per task', 'cost'],
        values: [
          ['4', '2.5M groups', 'big tasks, no slack'],
          ['16', '~600k', 'the sweet spot here'],
          ['200', '~50k', 'the default; fine'],
          ['2000', '~5k', 'start-up overhead wins'],
        ],
      },
      {
        id: 'partition-facts',
        kind: 'list',
        icon: 'layers',
        label: 'Size partitions, not counts',
        pattern: 'storage',
        items: [
          'Aim for roughly 100–200 MB per shuffle partition',
          'Enough partitions to keep every core busy, in waves',
          'Too many: task start-up dominates the run',
          'AQE coalesces small partitions for you',
        ],
      },
    ],
  },
)
