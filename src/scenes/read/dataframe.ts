import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { readTree } from './tree'
import code from '../../../spine/read/01-dataframe/project/jobs/daily_sales.py?raw'
import session from '../../../spine/read/01-dataframe/session.txt?raw'

export const dataframeRows: Scene = ideFrame(
  'dataframe-rows',
  'retail-pipeline',
  readTree(1),
  { file: 'jobs/daily_sales.py', code, show: [[13, 27]], highlight: [13, 22, 24, 25], terminal: session },
  {
    id: 'dataframe-rows-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'parts',
        kind: 'table',
        label: 'What a DataFrame has',
        headers: ['', 'here'],
        values: [
          ['rows', 'six orders, each a Row'],
          ['columns', 'order_id … status'],
          ['a schema', 'a type for every column'],
          ['partitions', 'four: one per slot'],
        ],
      },
      {
        id: 'guessed',
        kind: 'table',
        label: 'Types Spark chose from Python values',
        headers: ['column', 'Python', 'Spark'],
        values: [
          ['order_id', 'str', 'string'],
          ['store_id', 'int', 'bigint'],
          ['amount', 'float', 'double'],
          ['status', 'str', 'string'],
        ],
      },
      {
        id: 'dataframe-facts',
        kind: 'list',
        icon: 'table',
        label: 'Rows in a table, spread over partitions',
        pattern: 'storage',
        items: ['dtypes is the schema as (name, type) pairs', 'show(3) is an action: it runs a job for three rows', 'amount is a double — fine here, wrong for money'],
      },
    ],
  },
)
