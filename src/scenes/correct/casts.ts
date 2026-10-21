import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { correctTree } from './tree'
import code from '../../../spine/correct/03-casts/project/explore/casts.py?raw'
import session from '../../../spine/correct/03-casts/session.txt?raw'

export const castsAnsi: Scene = ideFrame(
  'casts-ansi',
  'retail-pipeline',
  correctTree(3, 'explore/casts.py'),
  { file: 'explore/casts.py', code: code, show: [[10, 26]], highlight: [11, 12, 13, 14, 20, 22, 24], terminal: session },
  {
    id: 'casts-ansi-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'ansi',
        kind: 'table',
        label: 'What changed in pipeline/',
        headers: ['file', 'now'],
        values: [
          ['schemas.py', 'amount STRING: read the text'],
          ['clean.py', 'try_cast to DECIMAL(10,2)'],
          ['clean.py', 'NULL → "amount is not a number"'],
        ],
      },
      {
        id: 'ansi-facts',
        kind: 'list',
        icon: 'shieldcheck',
        label: 'Fail loudly, decide explicitly',
        pattern: 'storage',
        items: [
          'ANSI mode is on by default in Spark 4.0',
          'CAST of bad text is an error, not a quiet NULL',
          'TRY_CAST is the explicit "NULL if it does not fit"',
          'With ANSI off, an int overflow wraps to a negative number',
        ],
      },
    ],
  },
)
