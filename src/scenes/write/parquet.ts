import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { writeTree } from './tree'
import code from '../../../spine/write/01-parquet/project/jobs/daily_sales.py?raw'
import session from '../../../spine/write/01-parquet/session.txt?raw'

export const writeParquet: Scene = ideFrame(
  'write-parquet',
  'retail-pipeline',
  writeTree(1),
  { file: 'jobs/daily_sales.py', code: code, show: [[19, 33]], highlight: [28, 30, 31], terminal: session },
  {
    id: 'write-parquet-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'modes',
        kind: 'table',
        label: 'Save modes',
        headers: ['mode', 'if the path exists'],
        values: [
          ['errorifexists', 'fail (the default)'],
          ['overwrite', 'replace everything'],
          ['append', 'add more files'],
          ['ignore', 'do nothing'],
        ],
      },
      {
        id: 'write-facts',
        kind: 'list',
        icon: 'harddrive',
        label: 'A folder, not a file',
        pattern: 'storage',
        items: [
          'One part file per partition that was written',
          '_SUCCESS is written last: the write finished',
          'The schema travels inside the Parquet files',
          'A random id in each name keeps writers apart',
        ],
      },
    ],
  },
)
