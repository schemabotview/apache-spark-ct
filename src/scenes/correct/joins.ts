import type { Scene } from '@graphlearning/flow'
import { fold, ideFrame } from '../ide'
import { correctTree } from './tree'
import code from '../../../spine/correct/04-joins/project/jobs/daily_sales.py?raw'
import session from '../../../spine/correct/04-joins/session.txt?raw'

export const joinCardinality: Scene = ideFrame(
  'join-cardinality',
  'retail-pipeline',
  correctTree(4, 'jobs/daily_sales.py'),
  { file: 'jobs/daily_sales.py', code: code, show: [[12, 21]], highlight: [14, 15, 16, 19], terminal: fold(session, [1, 10], [-3, -1]) },
  {
    id: 'join-cardinality-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'cardinality',
        kind: 'table',
        label: 'What a join does to row counts',
        headers: ['right side has', 'rows per order'],
        values: [
          ['exactly one match', 'one: as intended'],
          ['no match (inner)', 'zero: the order vanishes'],
          ['two matches', 'two: revenue doubles'],
        ],
      },
      {
        id: 'join-facts',
        kind: 'list',
        icon: 'link',
        label: 'Check the key before you trust the join',
        pattern: 'warn',
        items: [
          'stores.csv listed store 9 twice: York doubled to 125.00',
          '13 orders became 16 rows, and nothing failed',
          'enrich.with_city refuses a repeated store_id',
          'A left join keeps o7 and marks it unknown store',
        ],
      },
    ],
  },
)
