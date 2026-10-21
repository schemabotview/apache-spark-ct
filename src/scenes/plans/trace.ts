import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { plansTree } from './tree'
import code from '../../../spine/plans/06-trace/project/explore/trace.py?raw'
import session from '../../../spine/plans/06-trace/session.txt?raw'

export const planTrace: Scene = ideFrame(
  'plan-trace',
  'retail-pipeline',
  plansTree(6, 'explore/trace.py'),
  { file: 'explore/trace.py', code: code, show: [[9, 22]], highlight: [11, 12, 13, 16, 17, 21], terminal: session },
  {
    id: 'plan-trace-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'aqe-trace',
        kind: 'table',
        label: 'AQE off and on',
        headers: ['', 'AQE off', 'AQE on'],
        values: [
          ['final-sum tasks', '200', '1'],
          ['stages', '4', '4 + 1 skipped'],
          ['plan changed', 'no', 'AQEShuffleRead'],
        ],
      },
      {
        id: 'trace-facts',
        kind: 'list',
        icon: 'repeat',
        label: 'A plan that changes while it runs',
        pattern: 'storage',
        items: [
          'AQE runs each stage as its own query stage',
          'After the map side it knows the real sizes: 17 KB',
          'So it coalesced 200 shuffle partitions into 1',
          'Read a plan after the action to see what ran',
        ],
      },
    ],
  },
)
