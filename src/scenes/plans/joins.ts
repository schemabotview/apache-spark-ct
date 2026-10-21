import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { plansTree } from './tree'
import code from '../../../spine/plans/03-joins/project/explore/joins.py?raw'
import session from '../../../spine/plans/03-joins/session.txt?raw'

export const optimiseStrategy: Scene = ideFrame(
  'optimise-strategy',
  'retail-pipeline',
  plansTree(3, 'explore/joins.py'),
  { file: 'explore/joins.py', code: code, show: [[9, 24]], highlight: [12, 16, 17, 18, 19, 20, 21], terminal: session },
  {
    id: 'optimise-strategy-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'join-strategies',
        kind: 'table',
        label: 'How Spark can join',
        headers: ['strategy', 'when', 'moves'],
        values: [
          ['broadcast hash', 'one side small', 'the small side'],
          ['sort-merge', 'both large', 'both: 2 shuffles'],
          ['shuffle hash', 'one side medium', 'both, no sort'],
          ['nested loop', 'no equality key', 'everything'],
        ],
      },
      {
        id: 'optimise-facts',
        kind: 'list',
        icon: 'zap',
        label: 'Prune, push, then pick',
        pattern: 'storage',
        items: [
          'ReadSchema: four of five columns — order_id never read',
          'PushedFilters: the Parquet reader skips non-matches',
          'Under 10 MB the stores are broadcast: one Exchange',
          'Broadcast off: SortMergeJoin, and two more Exchanges',
        ],
      },
    ],
  },
)
