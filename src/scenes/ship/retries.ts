import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/07-retries/project/ops/retries.py?raw'
import session from '../../../spine/ship/07-retries/session.txt?raw'

export const retrySideEffects: Scene = ideFrame(
  'retry-side-effects',
  'retail-pipeline',
  shipTree(7),
  { file: 'ops/retries.py', code: code, show: [[9, 10], [16, 28]], highlight: [10, 20, 22, 27], terminal: session },
  {
    id: 'retry-side-effects-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'retry-defaults',
        kind: 'table',
        label: 'Retry settings (Spark 4.0.1 defaults)',
        headers: ['setting', 'default'],
        values: [
          ['spark.task.maxFailures', '4'],
          ['spark.speculation', 'false'],
          ['spark.speculation.multiplier', '3'],
          ['spark.speculation.quantile', '0.9'],
          ['spark.stage.maxConsecutiveAttempts', '4'],
        ],
      },
      {
        id: 'retry-facts',
        kind: 'list',
        icon: 'repeat',
        label: 'What a retry can and cannot undo',
        pattern: 'storage',
        items: [
          'A failed task is run again, from its input: same result',
          'Its side effects already happened: an email, a write',
          'Speculation runs a second copy of a slow task',
          'So a task must be safe to run twice: idempotent',
        ],
      },
    ],
  },
)
