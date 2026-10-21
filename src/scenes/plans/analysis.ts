import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { plansTree } from './tree'
import code from '../../../spine/plans/02-analysis/project/explore/analysis.py?raw'
import session from '../../../spine/plans/02-analysis/session.txt?raw'

export const planAnalysis: Scene = ideFrame(
  'plan-analysis',
  'retail-pipeline',
  plansTree(2, 'explore/analysis.py'),
  { file: 'explore/analysis.py', code: code, highlight: [8, 9, 10, 11, 12, 13], terminal: session },
  {
    id: 'plan-analysis-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'resolved',
        kind: 'table',
        label: 'What the analyzer did',
        headers: ['parsed', 'analyzed'],
        values: [
          ['\'order_id', 'order_id#0'],
          ['\'UnresolvedRelation', 'View → parquet'],
          ['amount * 2', 'amount * cast(2)'],
          ['amount > \'90\'', 'double > double'],
        ],
      },
      {
        id: 'analysis-facts',
        kind: 'list',
        icon: 'search',
        label: 'Comparing to a string costs precision',
        pattern: 'warn',
        items: [
          'Every name gets an id: #0 is order_id everywhere',
          'Types are checked, and casts made explicit',
          'A decimal compared with \'90\' became two doubles',
          'Write amount > 90: the decimal stays exact',
        ],
      },
    ],
  },
)
