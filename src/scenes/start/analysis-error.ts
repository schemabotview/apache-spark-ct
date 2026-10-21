import type { Scene } from '@graphlearning/flow'
import { fold, ideFrame, lineOf } from '../ide'
import { startTree } from './tree'
import code from '../../../spine/start/05-analysis-error/project/jobs/daily_sales.py?raw'
import session from '../../../spine/start/05-analysis-error/session.txt?raw'

// The whole run is ~110 terminal lines: PySpark 4 logs the error as one JSON record before raising
// it. The pane keeps the command, the first traceback frame and the error itself.
const tb = lineOf(session, 'Traceback')

export const analysisError: Scene = ideFrame(
  'analysis-error',
  'retail-pipeline',
  startTree('daily_sales.py'),
  { file: 'jobs/daily_sales.py', code, show: [[7, 22]], highlight: [18], pattern: 'warn', terminal: fold(session, [1, 2], [tb, tb + 2], [-6, -1]) },
  {
    id: 'analysis-error-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'when',
        kind: 'table',
        label: 'Where it stopped',
        headers: ['', 'this run'],
        values: [
          ['raised at', 'line 18, select()'],
          ['"plan built"', 'never printed'],
          ['jobs run', 'none'],
          ['condition', 'UNRESOLVED_COLUMN'],
        ],
      },
      {
        id: 'analysis-facts',
        kind: 'list',
        icon: 'search',
        label: 'Found by the analyzer',
        pattern: 'warn',
        items: [
          'Each transformation is checked as it is added to the plan',
          'An unknown column is caught before any data is read',
          'Spark suggests the names it does know: `amount`',
          'Spark Connect checks later, at the first action',
        ],
      },
    ],
  },
)
