import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/13-live-sales/project/jobs/live_sales.py?raw'
import session from '../../../spine/stream/13-live-sales/session.txt?raw'

export const liveSales: Scene = ideFrame(
  'live-sales',
  'retail-pipeline',
  streamTree(13),
  { file: 'jobs/live_sales.py', code: code, show: [[15, 29]], highlight: [17, 19, 21, 26], terminal: session },
  {
    id: 'live-sales-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'fate-table',
        kind: 'table',
        label: 'Every event\'s fate',
        headers: ['event', 'what happened'],
        values: [
          ['o1, o2', 'Leeds 09:00 window'],
          ['o2 resent', 'dropped: a duplicate'],
          ['o3', 'York 09:00 window'],
          ['o4, o5', 'York, Hull 09:10'],
          ['o7 (09:06, late)', 'dropped: by the dedupe'],
          ['o9 (09:02, late)', 'dropped: window final'],
          ['o6, o8', 'windows not yet final'],
        ],
      },
      {
        id: 'live-facts',
        kind: 'list',
        icon: 'circlecheck',
        label: 'The live job, end to end',
        pattern: 'storage',
        items: [
          'Dedupe within the watermark, then join, then window',
          'Append to Parquet: each window written once, final',
          'Restartable: the checkpoint carries offsets and state',
          'Every late order is a decision, not an accident',
        ],
      },
    ],
  },
)
