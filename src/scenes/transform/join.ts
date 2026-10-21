import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { transformTree } from './tree'
import code from '../../../spine/transform/05-join/project/jobs/daily_sales.py?raw'
import session from '../../../spine/transform/05-join/session.txt?raw'

export const joiningStores: Scene = ideFrame(
  'joining-stores',
  'retail-pipeline',
  transformTree(),
  { file: 'jobs/daily_sales.py', code, show: [[19, 34]], highlight: [23, 25, 26, 31], terminal: session },
  {
    id: 'joining-stores-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'join-types',
        kind: 'table',
        label: 'What each join keeps',
        headers: ['how', 'keeps'],
        values: [['inner', 'orders that have a store'], ['left', 'every order; city NULL if none'], ['left_anti', 'orders with no store'], ['left_semi', 'orders with a store, no city'], ['full', 'both sides, matched or not']],
      },
      {
        id: 'joining-stores-facts',
        kind: 'list',
        icon: 'link',
        label: 'The summary, at last',
        pattern: 'storage',
        items: ['on="store_id" joins on the name and keeps one copy', 'The result matches Course 1’s table, row for row', 'left_anti found none today — Course 8 meets store 15'],
      },
    ],
  },
)
