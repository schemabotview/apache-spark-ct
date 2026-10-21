import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/01-baseline/project/tools/bench.py?raw'
import session from '../../../spine/fast/01-baseline/session.txt?raw'

export const perfBaseline: Scene = ideFrame(
  'perf-baseline',
  'retail-pipeline',
  fastTree(1),
  { file: 'tools/bench.py', code: code, show: [[9, 17], [25, 28]], highlight: [11, 13, 14, 15, 16, 17, 27], terminal: session },
  {
    id: 'perf-baseline-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'rules',
        kind: 'table',
        label: 'Rules for a number you can trust',
        headers: ['rule', 'why'],
        values: [
          ['representative data', '10M rows, not six'],
          ['a warm-up run, thrown away', 'JVM and file cache'],
          ['median of three', 'one run is noise'],
          ['a checksum', 'fast and wrong is wrong'],
          ['one machine, stated', '4 cores, 15 GB, local[4]'],
        ],
      },
      {
        id: 'baseline-facts',
        kind: 'list',
        icon: 'gauge',
        label: 'The baseline',
        pattern: 'storage',
        items: [
          '10,000,000 orders, 8 Parquet files',
          '150 rows, £420,018,198.57: the checksum',
          'About 2½ seconds — and it moves between runs',
          'noop: compute every row, write nowhere',
        ],
      },
    ],
  },
)
