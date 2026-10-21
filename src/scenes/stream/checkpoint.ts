import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/11-checkpoint/project/stream/checkpoint.py?raw'
import session from '../../../spine/stream/11-checkpoint/session.txt?raw'

export const checkpointRestart: Scene = ideFrame(
  'checkpoint-restart',
  'retail-pipeline',
  streamTree(11),
  { file: 'stream/checkpoint.py', code: code, show: [[11, 17], [26, 29]], highlight: [11, 13, 14, 26], terminal: session },
  {
    id: 'checkpoint-restart-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'checkpoint-dirs',
        kind: 'table',
        label: 'data/stream/checkpoints/restart/',
        headers: ['folder', 'holds'],
        values: [
          ['metadata', 'the query id'],
          ['offsets', 'each batch\'s range, before it runs'],
          ['commits', 'each batch that finished'],
          ['sources', 'the files the source has read'],
          ['state', 'the running totals, per partition'],
        ],
      },
      {
        id: 'restart-facts',
        kind: 'list',
        icon: 'repeat',
        label: 'Which changes a checkpoint survives',
        pattern: 'storage',
        items: [
          'New filters or columns that keep the state: usually',
          'Changing the aggregation or its keys: no',
          'Changing shuffle partitions: no, fixed at the first run',
          'Changing the source: no — start a new checkpoint',
        ],
      },
    ],
  },
)
