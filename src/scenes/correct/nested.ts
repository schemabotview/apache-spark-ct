import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { correctTree } from './tree'
import code from '../../../spine/correct/07-nested/project/explore/nested.py?raw'
import session from '../../../spine/correct/07-nested/session.txt?raw'

export const nestedData: Scene = ideFrame(
  'nested-data',
  'retail-pipeline',
  correctTree(7, 'explore/nested.py'),
  { file: 'explore/nested.py', code: code, show: [[6, 21]], highlight: [7, 8, 9, 10, 13, 15, 18, 20], terminal: session },
  {
    id: 'nested-data-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'nested-types',
        kind: 'table',
        label: 'Three nested types',
        headers: ['type', 'here', 'reach in with'],
        values: [
          ['STRUCT', 'customer', 'customer.city'],
          ['ARRAY', 'items', 'size(), explode()'],
          ['MAP', '—', 'map["key"]'],
        ],
      },
      {
        id: 'nested-facts',
        kind: 'list',
        icon: 'boxes',
        label: 'The trap in explode()',
        pattern: 'warn',
        items: [
          'explode makes one row per item — and drops empty baskets',
          'explode_outer keeps them, with a NULL item',
          'After exploding, order-level columns repeat per item',
          'sum(amount) became 95.00 for 55.00 of orders',
        ],
      },
    ],
  },
)
