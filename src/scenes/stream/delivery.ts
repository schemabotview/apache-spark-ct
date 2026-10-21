import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/12-delivery/project/stream/delivery.py?raw'
import session from '../../../spine/stream/12-delivery/session.txt?raw'

export const deliveryGuarantees: Scene = ideFrame(
  'delivery-guarantees',
  'retail-pipeline',
  streamTree(12),
  { file: 'stream/delivery.py', code: code, show: [[26, 28], [32, 34], [39, 45]], highlight: [27, 33, 45], terminal: session },
  {
    id: 'delivery-guarantees-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'delivery-table',
        kind: 'table',
        label: 'A crash after writing batch 2',
        headers: ['writer', 'rows on disk', 'for 10 events'],
        values: [
          ['append', '12', 'o6 and o7 twice'],
          ['by_batch', '10', 'batch 2 replaced'],
        ],
      },
      {
        id: 'delivery-facts',
        kind: 'list',
        icon: 'shieldcheck',
        label: 'Exactly once, end to end',
        pattern: 'storage',
        items: [
          'The file source replays batch 2: same offsets, same rows',
          'A sink that adds rows doubles them on a replay',
          'A sink keyed by batch id makes the replay harmless',
          'foreachBatch is as safe as the code you write in it',
        ],
      },
    ],
  },
)
