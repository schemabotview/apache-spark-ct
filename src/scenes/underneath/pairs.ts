import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { underneathTree } from './tree'
import code from '../../../spine/underneath/02-pairs/project/explore/pair_rdds.py?raw'
import session from '../../../spine/underneath/02-pairs/session.txt?raw'

export const pairRdds: Scene = ideFrame(
  'pair-rdds',
  'retail-pipeline',
  underneathTree(2),
  { file: 'explore/pair_rdds.py', code: code, show: [[9, 23]], highlight: [12, 14, 15, 18, 21], terminal: session },
  {
    id: 'pair-rdds-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'shuffled',
        kind: 'table',
        label: 'What each one shuffled',
        headers: ['', 'records', 'bytes'],
        values: [
          ['reduceByKey', '12', '868'],
          ['groupByKey', '12', '335,705'],
        ],
      },
      {
        id: 'pairs-facts',
        kind: 'list',
        icon: 'merge',
        label: 'Reduce before you move',
        pattern: 'warn',
        items: [
          'reduceByKey adds up inside each partition first',
          'Only one running total per key per partition moves',
          'groupByKey moves every value, then adds',
          'PySpark packs values into lists: same records, 387× the bytes',
        ],
      },
    ],
  },
)
