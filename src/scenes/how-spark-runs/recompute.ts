import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runsTree } from './tree'
import code from '../../../spine/how-spark-runs/08-recompute/project/recompute.py?raw'
import session from '../../../spine/how-spark-runs/08-recompute/session.txt?raw'

// The failure is staged (attempt 0 of partition 2 raises), but the retry is Spark's own: local[4, 2]
// allows two attempts per task, and the log lines are what the driver printed, one line per event.
export const recompute: Scene = ideFrame(
  'task-recompute',
  'how-spark-runs',
  runsTree('recompute.py', 'recompute.py'),
  { file: 'recompute.py', code, show: [[8, 8], [11, 24]], highlight: [8, 13, 15, 20], terminal: session },
  {
    id: 'task-recompute-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'attempts',
        kind: 'table',
        label: 'What ran',
        headers: ['partition', 'numbers', 'attempts', 'subtotal'],
        values: [
          ['0', '1–25', '1', '325'],
          ['1', '26–50', '1', '950'],
          ['2', '51–75', '2', '1,575'],
          ['3', '76–100', '1', '2,200'],
        ],
      },
      {
        id: 'lineage',
        kind: 'list',
        icon: 'repeat',
        label: 'Lineage, not replicas',
        pattern: 'service',
        items: [
          'The driver knows how every partition is computed',
          'A lost task is re-run from its input — on any free slot',
          'Only partition 2 ran twice; 0, 1 and 3 were kept',
          'Plain local[4] never retries; a cluster allows 4 attempts',
        ],
      },
    ],
  },
)
