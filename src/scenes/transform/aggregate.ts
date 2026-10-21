import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { transformTree } from './tree'
import code from '../../../spine/transform/04-aggregate/project/jobs/daily_sales.py?raw'
import session from '../../../spine/transform/04-aggregate/session.txt?raw'

export const groupAggregate: Scene = ideFrame(
  'group-aggregate',
  'retail-pipeline',
  transformTree(),
  { file: 'jobs/daily_sales.py', code, show: [[19, 35]], highlight: [23, 24, 25, 26, 27, 28, 30], terminal: session },
  {
    id: 'group-aggregate-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'agg-types',
        kind: 'table',
        label: 'Aggregates and their types',
        headers: ['aggregate', 'type'],
        values: [['sum(amount)', 'decimal(20,2)'], ['count(*)', 'bigint'], ['avg(amount)', 'decimal(14,6)']],
      },
      {
        id: 'group-aggregate-facts',
        kind: 'list',
        icon: 'sigma',
        label: 'groupBy is a shuffle',
        pattern: 'storage',
        items: ['groupBy() alone returns GroupedData; agg() makes a DataFrame', 'Every row of a store must meet: one Exchange', 'sum widens precision so a total cannot overflow', 'orderBy sorts the whole result: a second shuffle'],
      },
    ],
  },
)
