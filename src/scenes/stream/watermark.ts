import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/07-watermark/project/stream/watermark.py?raw'
import session from '../../../spine/stream/07-watermark/session.txt?raw'

export const watermarkAppend: Scene = ideFrame(
  'watermark-append',
  'retail-pipeline',
  streamTree(7),
  { file: 'stream/watermark.py', code: code, show: [[14, 16], [20, 22], [25, 32]], highlight: [14, 27], terminal: session },
  {
    id: 'watermark-append-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'mark-table',
        kind: 'table',
        label: 'The watermark, file by file',
        headers: ['after', 'max event time', 'watermark'],
        values: [
          ['1.json', '09:08', '08:58'],
          ['2.json', '09:17', '09:07'],
          ['3.json', '09:23', '09:13'],
          ['4.json', '09:31', '09:21'],
        ],
      },
      {
        id: 'mark-facts',
        kind: 'list',
        icon: 'clock',
        label: 'A ten-minute watermark',
        pattern: 'storage',
        items: [
          'watermark = latest event time seen − 10 minutes',
          'A window is final once the watermark passes its end',
          'Append mode emits a window once, when it is final',
          'An order older than the watermark can be dropped',
        ],
      },
    ],
  },
)
