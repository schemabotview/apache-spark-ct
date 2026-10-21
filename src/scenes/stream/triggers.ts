import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/04-triggers/project/stream/triggers.py?raw'
import session from '../../../spine/stream/04-triggers/session.txt?raw'

export const triggerModes: Scene = ideFrame(
  'trigger-modes',
  'retail-pipeline',
  streamTree(4),
  { file: 'stream/triggers.py', code: code, show: [[11, 26]], highlight: [15, 23, 25], terminal: session },
  {
    id: 'trigger-modes-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'trigger-table',
        kind: 'table',
        label: 'Triggers, from the Spark 4.0.1 guide',
        headers: ['trigger', 'when a batch runs'],
        values: [
          ['(none)', 'when the last batch ends'],
          ['processingTime', 'on an interval, if new data'],
          ['availableNow', 'all that waits, then stop'],
          ['once', 'deprecated: availableNow'],
          ['continuous', 'experimental, map-only'],
        ],
      },
      {
        id: 'trigger-facts',
        kind: 'list',
        icon: 'clock',
        label: 'What a trigger decides',
        pattern: 'storage',
        items: [
          'When the next micro-batch starts, not what it computes',
          'availableNow runs as many batches as limits allow, then stops',
          'maxFilesPerTrigger caps the size of each batch',
          'Same input, same answer: only the batching changes',
        ],
      },
    ],
  },
)
