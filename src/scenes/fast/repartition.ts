import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/05-repartition/project/perf/repartition.py?raw'
import session from '../../../spine/fast/05-repartition/session.txt?raw'

export const repartitionCoalesce: Scene = ideFrame(
  'repartition-coalesce',
  'retail-pipeline',
  fastTree(5),
  { file: 'perf/repartition.py', code: code, show: [[8, 22]], highlight: [12, 13, 14, 15, 18, 19, 20], terminal: session },
  {
    id: 'repartition-coalesce-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'rep-coal',
        kind: 'table',
        label: 'repartition or coalesce',
        headers: ['', 'repartition(n)', 'coalesce(n)'],
        values: [
          ['shuffle', 'yes, always', 'no'],
          ['can grow n', 'yes', 'no, only shrink'],
          ['balance', 'even', 'uneven, by input'],
          ['parallelism', 'n tasks write', 'n tasks do everything'],
        ],
      },
      {
        id: 'rep-facts',
        kind: 'list',
        icon: 'swap',
        label: 'The one-file trade',
        pattern: 'warn',
        items: [
          'coalesce(1): one file, but one task did the whole job',
          'repartition(16): 16 even files, paid for with a shuffle',
          'Want fewer files? coalesce. Want even ones? repartition',
          'Never coalesce(1) a big result to “make one file”',
        ],
      },
    ],
  },
)
