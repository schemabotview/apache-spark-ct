import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { correctTree } from './tree'
import code from '../../../spine/correct/09-quality/project/pipeline/quality.py?raw'
import session from '../../../spine/correct/09-quality/session.txt?raw'

export const qualityInvariants: Scene = ideFrame(
  'quality-invariants',
  'retail-pipeline',
  correctTree(9, 'pipeline/quality.py'),
  { file: 'pipeline/quality.py', code: code, show: [[8, 23]], highlight: [8, 9, 10, 12, 14, 15, 16, 18], terminal: session },
  {
    id: 'quality-invariants-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'caught',
        kind: 'table',
        label: 'Every problem, and where it went',
        headers: ['event', 'problem', 'handled by'],
        values: [
          ['truncated line', 'not valid JSON', 'clean.parse'],
          ['o8', 'no amount', 'clean.parse'],
          ['o9', 'no status', 'clean.parse'],
          ['o10, "12,50"', 'not a number', 'clean.parse'],
          ['o7, store 15', 'unknown store', 'enrich'],
          ['o2 refunded', '—', 'clean.latest'],
          ['o4 resent', '—', 'clean.latest'],
          ['o15 at 23:30', '—', 'summarise'],
        ],
      },
      {
        id: 'quality-facts',
        kind: 'list',
        icon: 'circlecheck',
        label: 'The run proves itself',
        pattern: 'storage',
        items: [
          'Each order counted once; every amount positive',
          'Money in equals money out, to the penny',
          'Rejected rows are written, with their reason',
        ],
      },
    ],
  },
)
