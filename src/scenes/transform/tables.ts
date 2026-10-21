import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { transformTree } from './tree'
import code from '../../../spine/transform/07-tables/project/jobs/daily_sales.py?raw'
import session from '../../../spine/transform/07-tables/session.txt?raw'

export const tablesCatalog: Scene = ideFrame(
  'tables-catalog',
  'retail-pipeline',
  transformTree(true),
  { file: 'jobs/daily_sales.py', code, show: [[20, 36]], highlight: [29, 30, 32, 33, 34], terminal: session },
  {
    id: 'tables-catalog-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'view-table',
        kind: 'table',
        label: 'A view is not a table',
        headers: ['', 'temp view', 'managed table'],
        values: [['stores data', 'no', 'yes, Parquet'], ['where', '—', 'spark-warehouse/'], ['lives', 'this session', 'its files stay'], ['made by', 'createTempView', 'saveAsTable']],
      },
      {
        id: 'tables-catalog-facts',
        kind: 'list',
        icon: 'warehouse',
        label: 'The catalog names things',
        pattern: 'storage',
        items: ['saveAsTable wrote Parquet under spark-warehouse/', 'This session’s catalog is in memory: the name is not kept', 'A metastore keeps names across sessions (Course 12)'],
      },
    ],
  },
)
