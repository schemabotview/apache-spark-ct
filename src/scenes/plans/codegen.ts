import type { Scene } from '@graphlearning/flow'
import { fold, ideFrame } from '../ide'
import { plansTree } from './tree'
import code from '../../../spine/plans/04-codegen/project/explore/codegen.py?raw'
import session from '../../../spine/plans/04-codegen/session.txt?raw'

export const codegenMemory: Scene = ideFrame(
  'codegen-memory',
  'retail-pipeline',
  plansTree(4, 'explore/codegen.py'),
  { file: 'explore/codegen.py', code: code, show: [[9, 21]], highlight: [10, 14, 15, 19, 20], terminal: fold(session, [1, 3], [4, 8], [13, 16]) },
  {
    id: 'codegen-memory-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'memory',
        kind: 'table',
        label: 'Inside an executor’s heap',
        headers: ['region', 'size here', 'used for'],
        values: [
          ['reserved', '300 MiB', 'Spark’s own objects'],
          ['unified (0.6)', '434 MiB', 'execution + storage'],
          ['user (0.4)', 'the rest', 'your data structures'],
        ],
      },
      {
        id: 'codegen-facts',
        kind: 'list',
        icon: 'cpu',
        label: 'One function per stage',
        pattern: 'storage',
        items: [
          '*(n): operators fused into one generated Java function',
          '3 subtrees: the csv filter, the scan-to-partial-sum, the final sum',
          'An Exchange always ends a fused subtree',
          'Execution can borrow storage memory, and evict cached blocks',
        ],
      },
    ],
  },
)
