import type { Scene } from '@graphlearning/flow'
import { fold, ideFrame } from '../ide'
import { startTree } from './tree'
import code from '../../../spine/start/06-job-error/project/jobs/daily_sales.py?raw'
import session from '../../../spine/start/06-job-error/session.txt?raw'

// Kept: the command and the first executor error, the line that aborts the job, and the error as
// Python finally raises it — which names the cast on line 18, not the show() on line 20.
const abort = session.split('\n').findIndex((l) => l.startsWith('ERROR TaskSetManager')) + 1

export const jobError: Scene = ideFrame(
  'job-error',
  'retail-pipeline',
  startTree('daily_sales.py'),
  { file: 'jobs/daily_sales.py', code, show: [[7, 22]], highlight: [15, 18, 20], pattern: 'warn', terminal: fold(session, [1, 4], [abort, abort], [-7, -1]) },
  {
    id: 'job-error-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'two-errors',
        kind: 'table',
        label: 'Two kinds of failure',
        headers: ['', 'analysis', 'execution'],
        values: [
          ['found by', 'the driver', 'an executor'],
          ['when', 'building the plan', 'at the action'],
          ['data read?', 'none', 'up to the bad row'],
          ['example', 'UNRESOLVED_COLUMN', 'CAST_INVALID_INPUT'],
        ],
      },
      {
        id: 'job-error-facts',
        kind: 'list',
        icon: 'bug',
        label: 'Found while the job ran',
        pattern: 'warn',
        items: [
          '"plan built" printed: the plan itself was valid',
          '"12,50" only fails when a task reaches it',
          'ANSI mode, on by default in Spark 4, fails loudly',
          'try_cast would give NULL instead — Course 8',
        ],
      },
    ],
  },
)
