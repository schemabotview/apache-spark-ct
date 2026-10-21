import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/08-cache/project/perf/cache.py?raw'
import session from '../../../spine/fast/08-cache/session.txt?raw'

export const cacheTradeoff: Scene = ideFrame(
  'cache-tradeoff',
  'retail-pipeline',
  fastTree(8),
  { file: 'perf/cache.py', code: code, show: [[9, 23]], highlight: [11, 12, 14, 15, 16, 20], terminal: session },
  {
    id: 'cache-tradeoff-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'cache-levels',
        kind: 'table',
        label: 'Storage levels',
        headers: ['level', 'keeps'],
        values: [
          ['MEMORY_AND_DISK', 'memory, then disk'],
          ['MEMORY_ONLY', 'memory; recompute rest'],
          ['DISK_ONLY', 'local disk only'],
        ],
      },
      {
        id: 'cache-facts',
        kind: 'list',
        icon: 'memory',
        label: 'Cache only what is reused and costly',
        pattern: 'storage',
        items: [
          'The second action saved about a tenth of a second',
          'The cache holds 69 MB of execution’s memory',
          'A Parquet scan of 4 columns is already cheap',
          'Cache after an expensive step, not after a read',
        ],
      },
    ],
  },
)
