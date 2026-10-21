import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/10-aqe/project/perf/aqe.py?raw'
import session from '../../../spine/fast/10-aqe/session.txt?raw'

export const aqeRuntime: Scene = ideFrame(
  'aqe-runtime',
  'retail-pipeline',
  fastTree(10),
  { file: 'perf/aqe.py', code: code, show: [[6, 21]], highlight: [8, 9, 17, 18, 19], terminal: session },
  {
    id: 'aqe-runtime-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'aqe-does',
        kind: 'table',
        label: 'What AQE changes at runtime',
        headers: ['when it sees', 'it does'],
        values: [
          ['tiny shuffle partitions', 'coalesces them'],
          ['a small join side', 'switches to broadcast'],
          ['a skewed partition (> 256 MB)', 'splits it'],
          ['an empty side', 'skips the work'],
        ],
      },
      {
        id: 'aqe-facts',
        kind: 'list',
        icon: 'repeat',
        label: 'Plans from estimates, fixed by facts',
        pattern: 'storage',
        items: [
          'Spark could not know how few rows amount > 99.9 keeps',
          'So it planned a sort-merge join for “all of orders”',
          'After the filter ran: 9,905 rows — under 10 MB',
          'The final plan used BroadcastHashJoin',
        ],
      },
    ],
  },
)
