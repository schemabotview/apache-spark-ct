import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/02-progress/project/stream/progress.py?raw'
import session from '../../../spine/stream/02-progress/session.txt?raw'

export const streamingEngine: Scene = ideFrame(
  'streaming-engine',
  'retail-pipeline',
  streamTree(2),
  { file: 'stream/progress.py', code: code, show: [[11, 25]], highlight: [17, 21, 22, 23], terminal: session },
  {
    id: 'streaming-engine-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'progress-fields',
        kind: 'table',
        label: 'Read from lastProgress',
        headers: ['field', 'what it is'],
        values: [
          ['batchId', 'the micro-batch number'],
          ['numInputRows', 'rows read by this batch'],
          ['sources[0].endOffset', 'how far the source has read'],
          ['stateOperators[0]', 'the rows kept as state'],
          ['eventTime.watermark', 'the bound on lateness (§7)'],
        ],
      },
      {
        id: 'engine-facts',
        kind: 'list',
        icon: 'repeat',
        label: 'One micro-batch, in order',
        pattern: 'storage',
        items: [
          'Ask the source what is new: an offset range',
          'Write that range to the checkpoint, before running',
          'Run the plan on just those rows, updating the state',
          'Hand the result to the sink, then commit the batch',
        ],
      },
    ],
  },
)
