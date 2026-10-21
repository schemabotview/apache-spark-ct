import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/04-capacity/project/tools/capacity.py?raw'
import session from '../../../spine/ship/04-capacity/session.txt?raw'

export const capacityPlan: Scene = ideFrame(
  'capacity-plan',
  'retail-pipeline',
  shipTree(4),
  { file: 'tools/capacity.py', code: code, show: [[3, 19]], highlight: [7, 8, 10, 16], terminal: session },
  {
    id: 'capacity-plan-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'capacity-table',
        kind: 'table',
        label: 'The year\'s backfill: 70 TB at 2 GB/s',
        headers: ['machines', 'wall clock', 'machine-hours'],
        values: [
          ['1', '583 min', '9.7'],
          ['10', '58 min', '9.7'],
          ['50', '12 min', '9.7'],
        ],
      },
      {
        id: 'capacity-facts',
        kind: 'list',
        icon: 'gauge',
        label: 'Sizing, as arithmetic',
        pattern: 'storage',
        items: [
          'Executor memory is heap + overhead: max(384 MB, 10%)',
          'Leave a core and some memory per node for the OS',
          'More machines buy time, not fewer machine-hours',
          'The 2 GB/s is an assumption: measure your own',
        ],
      },
    ],
  },
)
