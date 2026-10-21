import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { transformTree } from './tree'
import code from '../../../spine/transform/01-columns/project/jobs/daily_sales.py?raw'
import session from '../../../spine/transform/01-columns/session.txt?raw'

export const columnsExpressions: Scene = ideFrame(
  'columns-expressions',
  'retail-pipeline',
  transformTree(),
  { file: 'jobs/daily_sales.py', code, show: [[3, 3], [20, 32]], highlight: [3, 26, 27, 28], terminal: session },
  {
    id: 'columns-expressions-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'types',
        kind: 'table',
        label: 'Types follow the arithmetic',
        headers: ['expression', 'type'],
        values: [['amount', 'decimal(10,2)'], ['amount * 0.2', 'double'], ['amount * Decimal("0.20")', 'decimal(13,4)'], ['amount + vat', 'decimal(14,4)']],
      },
      {
        id: 'columns-expressions-facts',
        kind: 'list',
        icon: 'hash',
        label: 'An expression is a recipe',
        pattern: 'storage',
        items: ['F.col("amount") names a column; it holds no data', 'Arithmetic builds a new column, row by row, in the JVM', 'alias names it; withColumn adds or replaces one', 'A Python float literal turns money into a double'],
      },
    ],
  },
)
