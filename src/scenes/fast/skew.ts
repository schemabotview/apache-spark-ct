import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/07-skew/project/perf/skew.py?raw'
import session from '../../../spine/fast/07-skew/session.txt?raw'

export const dataSkew: Scene = ideFrame(
  'data-skew',
  'retail-pipeline',
  fastTree(7),
  { file: 'perf/skew.py', code: code, show: [[18, 33]], highlight: [18, 19, 20, 21, 22, 26, 32, 33], terminal: session },
  {
    id: 'data-skew-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'remedies',
        kind: 'table',
        label: 'Remedies for a hot key',
        headers: ['remedy', 'here'],
        values: [
          ['salting', '10× faster'],
          ['AQE skew join', 'only > 256 MB'],
          ['broadcast small side', 'no shuffle'],
          ['hot key apart', 'join it alone'],
          ['pre-aggregate', 'fewer rows'],
        ],
      },
      {
        id: 'skew-facts',
        kind: 'list',
        icon: 'gauge',
        label: 'The slowest task sets the pace',
        pattern: 'warn',
        items: [
          'Store 7 has half of the 10 million orders',
          'Median task: ~10 ms. Slowest: ~5 s',
          '16 salts split store 7 over 16 tasks',
          'Read task quantiles, not averages',
        ],
      },
    ],
  },
)
