import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/10-joins/project/stream/joins.py?raw'
import session from '../../../spine/stream/10-joins/session.txt?raw'

export const streamingJoins: Scene = ideFrame(
  'streaming-joins',
  'retail-pipeline',
  streamTree(10),
  { file: 'stream/joins.py', code: code, show: [[12, 23], [32, 34]], highlight: [15, 20, 21, 22, 23], terminal: session },
  {
    id: 'streaming-joins-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'join-table',
        kind: 'table',
        label: 'Orders joined to payments',
        headers: ['order', 'placed', 'paid', 'matched?'],
        values: [
          ['o1', '09:01', '09:05', 'yes, batch 0'],
          ['o4', '09:14', '09:20', 'yes, after 2.json'],
          ['o5', '09:17', '10:10', 'no: over 30 min'],
          ['the rest', '', 'none', 'no payment'],
        ],
      },
      {
        id: 'join-facts',
        kind: 'list',
        icon: 'merge',
        label: 'Two kinds of streaming join',
        pattern: 'storage',
        items: [
          'Stream-static: each batch joins to the stores table',
          'Stream-stream: both sides are kept as state',
          'A time bound lets that state be dropped',
          'Inner join: a payment too late never matches',
        ],
      },
    ],
  },
)
