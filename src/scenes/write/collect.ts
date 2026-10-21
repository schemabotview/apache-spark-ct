import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { writeTree } from './tree'
import code from '../../../spine/write/03-collect/project/jobs/daily_sales.py?raw'
import session from '../../../spine/write/03-collect/session.txt?raw'

export const bringToDriver: Scene = ideFrame(
  'bring-to-driver',
  'retail-pipeline',
  writeTree(3),
  { file: 'jobs/daily_sales.py', code: code, show: [[22, 36]], highlight: [29, 30, 31, 33], terminal: session },
  {
    id: 'bring-to-driver-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'actions',
        kind: 'table',
        label: 'What comes back to the driver',
        headers: ['action', 'brings back'],
        values: [
          ['collect()', 'every row'],
          ['take(n)', 'n rows'],
          ['count()', 'one number'],
          ['toPandas()', 'every row, as pandas'],
          ['toLocalIterator()', 'a partition at a time'],
        ],
      },
      {
        id: 'collect-facts',
        kind: 'list',
        icon: 'download',
        label: 'The driver is one machine',
        pattern: 'warn',
        items: [
          'Results travel to the driver and sit in its memory',
          'spark.driver.maxResultSize defaults to 1g, then the job fails',
          'Aggregate on the cluster, collect the small result',
          'A write never passes through the driver',
        ],
      },
    ],
  },
)
