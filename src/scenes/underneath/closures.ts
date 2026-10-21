import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { underneathTree } from './tree'
import code from '../../../spine/underneath/03-closures/project/explore/closures.py?raw'
import session from '../../../spine/underneath/03-closures/session.txt?raw'

export const closuresShared: Scene = ideFrame(
  'closures-shared',
  'retail-pipeline',
  underneathTree(3),
  { file: 'explore/closures.py', code: code, show: [[12, 12], [17, 19], [22, 32]], highlight: [19, 23, 25, 26, 27, 29, 30], terminal: session },
  {
    id: 'closures-shared-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'shared',
        kind: 'table',
        label: 'Sharing with tasks',
        headers: ['', 'from → to', 'for'],
        values: [
          ['closure', 'driver → each task', 'small values'],
          ['broadcast', 'driver → executors', 'lookup tables'],
          ['accumulator', 'tasks → driver', 'counts'],
        ],
      },
      {
        id: 'closure-facts',
        kind: 'list',
        icon: 'share',
        label: 'A function travels as a copy',
        pattern: 'warn',
        items: [
          'counter += 1 changed copies on executors: the driver saw 0',
          'The accumulator added up across tasks: 7',
          'A broadcast is sent once per executor, not per task',
          'Accumulators in transformations can count twice on retry',
        ],
      },
    ],
  },
)
