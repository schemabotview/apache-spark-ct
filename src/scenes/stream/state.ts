import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/08-state/project/stream/state.py?raw'
import session from '../../../spine/stream/08-state/session.txt?raw'

export const stateGrowth: Scene = ideFrame(
  'state-growth',
  'retail-pipeline',
  streamTree(8),
  { file: 'stream/state.py', code: code, show: [[11, 24]], highlight: [13, 14, 15, 22], terminal: session },
  {
    id: 'state-growth-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'state-table',
        kind: 'table',
        label: 'State rows after each file',
        headers: ['after', 'no watermark', '10 min watermark'],
        values: [
          ['1.json', '3', '3'],
          ['2.json', '5', '5'],
          ['3.json', '7', '5'],
          ['4.json', '9', '4'],
        ],
      },
      {
        id: 'state-facts',
        kind: 'list',
        icon: 'memory',
        label: 'What state costs',
        pattern: 'storage',
        items: [
          'dropDuplicates keeps every key it has seen, for ever',
          'Within a watermark, a key is kept only while it can recur',
          'State lives on the executors, and in the checkpoint',
          'Unbounded state is a job that slowly runs out of memory',
        ],
      },
    ],
  },
)
