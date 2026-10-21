import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/09-output-modes/project/stream/output_modes.py?raw'
import session from '../../../spine/stream/09-output-modes/session.txt?raw'

export const outputModes: Scene = ideFrame(
  'output-modes',
  'retail-pipeline',
  streamTree(9),
  { file: 'stream/output_modes.py', code: code, show: [[14, 16], [21, 32]], highlight: [23, 30], terminal: session },
  {
    id: 'output-modes-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'modes-table',
        kind: 'table',
        label: 'Rows written so far',
        headers: ['after', 'append', 'update', 'complete'],
        values: [
          ['1.json', '0', '1', '1'],
          ['2.json', '0', '3', '3'],
          ['3.json', '1', '5', '6'],
          ['4.json', '2', '6', '10'],
        ],
      },
      {
        id: 'modes-rules',
        kind: 'table',
        label: 'What each mode writes',
        headers: ['mode', 'writes', 'needs'],
        values: [
          ['append', 'final rows, once', 'a watermark'],
          ['update', 'rows that changed', 'a sink that upserts'],
          ['complete', 'the whole result', 'small results'],
        ],
      },
    ],
  },
)
