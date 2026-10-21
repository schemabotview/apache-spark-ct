import type { Scene } from '@graphlearning/flow'
import { fold, ideFrame } from '../ide'
import { writeTree } from './tree'
import code from '../../../spine/write/04-side-effects/project/jobs/notify.py?raw'
import session from '../../../spine/write/04-side-effects/session.txt?raw'

export const taskSideEffects: Scene = ideFrame(
  'task-side-effects',
  'retail-pipeline',
  writeTree(4, 'jobs/notify.py'),
  { file: 'jobs/notify.py', code: code, show: [[9, 25]], highlight: [14, 16, 17, 18, 24], terminal: fold(session, [1, 2], [5, -1]) },
  {
    id: 'task-side-effects-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'safer',
        kind: 'table',
        label: 'Side effects that survive a retry',
        headers: ['approach', 'safe because'],
        values: [
          ['idempotent key', 'a repeat is ignored'],
          ['upsert', 'replaces, never adds'],
          ['send from driver', 'once, after the job'],
          ['transactional sink', 'commits on success'],
        ],
      },
      {
        id: 'effects-facts',
        kind: 'list',
        icon: 'repeat',
        label: 'Spark retries tasks, not effects',
        pattern: 'warn',
        items: [
          'A failed task runs again from the start',
          'Whatever it already did outside Spark stays done',
          'o11 was sent twice: once per attempt',
          'Speculation can run a task twice even without a failure',
        ],
      },
    ],
  },
)
