import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { readTree } from './tree'
import code from '../../../spine/read/03-schema/project/jobs/daily_sales.py?raw'
import session from '../../../spine/read/03-schema/session.txt?raw'

export const explicitSchema: Scene = ideFrame(
  'explicit-schema',
  'retail-pipeline',
  readTree(3),
  { file: 'jobs/daily_sales.py', code, show: [[13, 24]], highlight: [13, 14, 15, 16, 17, 22], terminal: session },
  {
    id: 'explicit-schema-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'declared',
        kind: 'table',
        label: 'Declared, and why',
        headers: ['column', 'type', 'because'],
        values: [
          ['order_id', 'STRING', 'an id, not a number'],
          ['store_id', 'INT', 'small, joins to stores'],
          ['amount', 'DECIMAL(10,2)', 'money: exact pence'],
          ['status', 'STRING', 'four known values'],
          ['event_time', 'TIMESTAMP', 'an instant, in UTC'],
        ],
      },
      {
        id: 'schema-facts',
        kind: 'list',
        icon: 'shieldcheck',
        label: 'A schema is a contract',
        pattern: 'storage',
        items: [
          'jobs run: [] — nothing was read to learn it',
          'Columns come back in the order we declared',
          'first() returns Decimal and datetime in Python',
          'A double cannot hold 0.10 exactly; a decimal can',
        ],
      },
    ],
  },
)
