import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { correctTree } from './tree'
import code from '../../../spine/correct/05-windows/project/pipeline/clean.py?raw'
import session from '../../../spine/correct/05-windows/session.txt?raw'

export const windowLatest: Scene = ideFrame(
  'window-latest',
  'retail-pipeline',
  correctTree(5, 'pipeline/clean.py'),
  { file: 'pipeline/clean.py', code: code, show: [[6, 22]], highlight: [18, 19, 20, 21, 22], terminal: session },
  {
    id: 'window-latest-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'window-fns',
        kind: 'table',
        label: 'Window functions over one order’s events',
        headers: ['function', 'gives'],
        values: [
          ['row_number()', '1, 2, 3 — no ties'],
          ['rank()', '1, 1, 3 — ties share'],
          ['lag("status")', 'the previous event’s status'],
          ['sum(...).over(w)', 'a running total'],
        ],
      },
      {
        id: 'window-facts',
        kind: 'list',
        icon: 'sortarrows',
        label: 'Every event kept, one row per order',
        pattern: 'storage',
        items: [
          'partitionBy: the group; orderBy: the order within it',
          'Newest first, keep n = 1: an update wins',
          'An exact resend is just a tie: one copy survives',
          'Unlike groupBy, a window keeps every column',
        ],
      },
    ],
  },
)
