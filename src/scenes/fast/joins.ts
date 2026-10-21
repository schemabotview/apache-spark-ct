import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/06-joins/project/perf/joins.py?raw'
import session from '../../../spine/fast/06-joins/session.txt?raw'

export const joinStrategies: Scene = ideFrame(
  'join-strategies',
  'retail-pipeline',
  fastTree(6),
  { file: 'perf/joins.py', code: code, show: [[8, 19]], highlight: [10, 11, 14, 15, 17, 18], terminal: session },
  {
    id: 'join-strategies-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'measured',
        kind: 'table',
        label: 'Same join, three strategies',
        headers: ['hint', 'strategy', 'moves'],
        values: [
          ['broadcast', 'BroadcastHashJoin', '505 B, once'],
          ['shuffle_hash', 'ShuffledHashJoin', 'both, hashed'],
          ['merge', 'SortMergeJoin', 'both, sorted'],
        ],
      },
      {
        id: 'join-facts',
        kind: 'list',
        icon: 'link',
        label: 'Broadcast when one side is small',
        pattern: 'storage',
        items: [
          'Spark estimated stores at 505 bytes, orders at 91 MiB',
          'Under the 10 MB threshold: broadcast, by default',
          'Broadcast ran in under half the sort-merge time',
          'An estimate can be wrong — section 10 shows AQE’s fix',
        ],
      },
    ],
  },
)
