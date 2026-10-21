import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/12-compare/project/perf/compare.py?raw'
import session from '../../../spine/fast/12-compare/session.txt?raw'

export const beforeAfter: Scene = ideFrame(
  'before-after',
  'retail-pipeline',
  fastTree(12),
  { file: 'perf/compare.py', code: code, show: [[7, 23]], highlight: [7, 8, 9, 10, 11, 12, 13, 17, 18, 20, 22, 23], terminal: session },
  {
    id: 'before-after-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'what-numbers-say',
        kind: 'table',
        label: 'What these numbers can say',
        headers: ['claim', 'supported?'],
        values: [
          ['all four gave the same answer', 'yes: checksums equal'],
          ['16 partitions is faster', 'within noise: no'],
          ['2000 + AQE off is slower', 'yes: ~3× the time'],
          ['it will hold on a cluster', 'not measured here'],
        ],
      },
      {
        id: 'compare-facts',
        kind: 'list',
        icon: 'scale',
        label: 'Before claiming an improvement',
        pattern: 'storage',
        items: [
          'Change one thing at a time, from the same baseline',
          'Check the result is identical: the checksum',
          'Know your noise: here, ±0.5 s on 2–3 s',
          'Say the machine, the data and the version',
        ],
      },
    ],
  },
)
