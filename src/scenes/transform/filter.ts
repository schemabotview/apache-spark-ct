import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { transformTree } from './tree'
import code from '../../../spine/transform/03-filter/project/jobs/daily_sales.py?raw'
import session from '../../../spine/transform/03-filter/session.txt?raw'

export const filterSelect: Scene = ideFrame(
  'filter-select',
  'retail-pipeline',
  transformTree(),
  { file: 'jobs/daily_sales.py', code, show: [[19, 30]], highlight: [22, 23, 27], terminal: session },
  {
    id: 'filter-select-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'same',
        kind: 'table',
        label: 'Three ways to keep rows',
        headers: ['call', 'note'],
        values: [['filter(cond)', 'a Column condition'], ['where(cond)', 'the same method'], ['where("...")', 'SQL text, same plan']],
      },
      {
        id: 'filter-select-facts',
        kind: 'list',
        icon: 'funnel',
        label: 'Keep less, early',
        pattern: 'storage',
        items: ['filter keeps rows; select keeps columns', 'Both are narrow: no data moves', 'Each count() is an action, and a job', 'Dropping columns early shrinks every later shuffle'],
      },
    ],
  },
)
