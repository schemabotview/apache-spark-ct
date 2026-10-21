import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { writeTree } from './tree'
import code from '../../../spine/write/02-partitioned/project/jobs/daily_sales.py?raw'
import session from '../../../spine/write/02-partitioned/session.txt?raw'

export const partitionedOutput: Scene = ideFrame(
  'partitioned-output',
  'retail-pipeline',
  writeTree(2),
  { file: 'jobs/daily_sales.py', code: code, show: [[22, 37]], highlight: [28, 29, 30, 31, 32, 33, 34, 35], terminal: session },
  {
    id: 'partitioned-output-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'pruning',
        kind: 'table',
        label: 'Asking for one day',
        headers: ['', 'reads'],
        values: [
          ['where day = 2026-10-02', 'day=2026-10-02/ only'],
          ['no filter on day', 'every day= folder'],
          ['where city = Leeds', 'every folder'],
        ],
      },
      {
        id: 'partitioned-facts',
        kind: 'list',
        icon: 'folder',
        label: 'The column becomes the folders',
        pattern: 'storage',
        items: [
          'day is stored in folder names, not in the files',
          'It comes back as the last column',
          'Partition by what readers filter on: a day, not an order',
          'Thousands of tiny folders cost more than they save',
        ],
      },
    ],
  },
)
