import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/01-incremental/project/stream/incremental.py?raw'
import session from '../../../spine/stream/01-incremental/session.txt?raw'

export const incrementalQuery: Scene = ideFrame(
  'incremental-query',
  'retail-pipeline',
  streamTree(1),
  { file: 'stream/incremental.py', code: code, show: [[10, 15], [18, 21], [24, 27]], highlight: [13, 26, 27], terminal: session },
  {
    id: 'incremental-query-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'totals',
        kind: 'table',
        label: 'Sales per store, after each file',
        headers: ['file', 'batch', '7', '9', '12'],
        values: [
          ['1.json', '0', '65.00', '15.00', '—'],
          ['2.json', '1', '90.00', '75.00', '80.00'],
          ['3.json', '2', '130.00', '75.00', '80.00'],
          ['4.json', '3', '130.00', '80.00', '100.00'],
        ],
      },
      {
        id: 'incremental-facts',
        kind: 'list',
        icon: 'waves',
        label: 'The daily job, as a query that never ends',
        pattern: 'storage',
        items: [
          'readStream: a folder to watch, not a file to read',
          'Each new file is a micro-batch, and updates the result',
          'Only new rows are read: the totals are kept as state',
          'o2 was sent twice: store 7 counts its 25.00 twice (§8)',
        ],
      },
    ],
  },
)
