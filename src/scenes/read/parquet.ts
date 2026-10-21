import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { readTree } from './tree'
import code from '../../../spine/read/05-parquet/project/jobs/daily_sales.py?raw'
import session from '../../../spine/read/05-parquet/session.txt?raw'

// The JDBC rows are from the Spark 4.0.1 JDBC data source guide; no database runs in this course.
export const sources: Scene = ideFrame(
  'file-sources',
  'retail-pipeline',
  readTree(5),
  { file: 'jobs/daily_sales.py', code, show: [[18, 32]], highlight: [26, 27, 28, 29, 30], terminal: session },
  {
    id: 'file-sources-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'promises',
        kind: 'table',
        label: 'What each source promises',
        headers: ['', 'schema from', 'skips data'],
        values: [
          ['JSON', 'a scan, or you', 'no'],
          ['CSV', 'you (header: names)', 'no'],
          ['Parquet', 'the file itself', 'columns, row groups'],
          ['JDBC', 'the database', 'the WHERE runs there'],
        ],
      },
      {
        id: 'jdbc',
        kind: 'list',
        icon: 'database',
        label: 'JDBC: one query per partition',
        pattern: 'storage',
        items: [
          'Without options, one task reads the whole table',
          'partitionColumn, lowerBound, upperBound, numPartitions',
          'split it into ranges — one query each, at once',
          'Every task is a connection: size it for the database',
        ],
      },
    ],
  },
)
