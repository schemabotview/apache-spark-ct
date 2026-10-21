import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { transformTree } from './tree'
import code from '../../../spine/transform/06-sql/project/jobs/daily_sales.py?raw'
import session from '../../../spine/transform/06-sql/session.txt?raw'

export const sparkSql: Scene = ideFrame(
  'spark-sql-views',
  'retail-pipeline',
  transformTree(),
  { file: 'jobs/daily_sales.py', code, show: [[22, 35]], highlight: [22, 23, 24, 32], terminal: session },
  {
    id: 'spark-sql-views-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'mapping',
        kind: 'table',
        label: 'DataFrame call → SQL clause',
        headers: ['DataFrame', 'SQL'],
        values: [['filter(...)', 'WHERE'], ['join(stores, ...)', 'JOIN … ON'], ['groupBy(...).agg(...)', 'GROUP BY + aggregates'], ['orderBy(...)', 'ORDER BY'], ['alias("sales")', 'AS sales']],
      },
      {
        id: 'spark-sql-views-facts',
        kind: 'list',
        icon: 'code',
        label: 'One engine, two languages',
        pattern: 'storage',
        items: ['A temp view is a name for a DataFrame, in this session', 'spark.sql() returns a DataFrame like any other', 'Both go through the same optimizer: the same plan', 'TEMPORARY: the name ends with the session'],
      },
    ],
  },
)
