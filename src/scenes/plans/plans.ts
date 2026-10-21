import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { plansTree } from './tree'
import code from '../../../spine/plans/01-plans/project/explore/plans.py?raw'
import session from '../../../spine/plans/01-plans/session.txt?raw'

export const codeToPlans: Scene = ideFrame(
  'code-to-plans',
  'retail-pipeline',
  plansTree(1, 'explore/plans.py'),
  { file: 'explore/plans.py', code: code, highlight: [8, 10, 11], terminal: session },
  {
    id: 'code-to-plans-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'catalyst',
        kind: 'table',
        label: 'Four plans, one query',
        headers: ['phase', 'does'],
        values: [
          ['parsed', 'reads the code: names are text'],
          ['analyzed', 'binds names, types, functions'],
          ['optimized', 'rewrites by rules: same result'],
          ['physical', 'chooses how: operators, joins'],
        ],
      },
      {
        id: 'plans-facts',
        kind: 'list',
        icon: 'workflow',
        label: 'The same summary, four times',
        pattern: 'storage',
        items: [
          '\'Aggregate: the quote marks “not resolved yet”',
          'Optimized: a Project prunes, Filters guard the join',
          'Physical: BroadcastHashJoin and one Exchange',
          'planview.py turns explain() text into these lists',
        ],
      },
    ],
  },
)
