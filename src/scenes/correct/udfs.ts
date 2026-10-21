import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { correctTree } from './tree'
import code from '../../../spine/correct/08-udfs/project/explore/udfs.py?raw'
import session from '../../../spine/correct/08-udfs/session.txt?raw'

export const udfBoundary: Scene = ideFrame(
  'udf-boundary',
  'retail-pipeline',
  correctTree(8, 'explore/udfs.py'),
  { file: 'explore/udfs.py', code: code, show: [[14, 21], [31, 35]], highlight: [14, 15, 19, 20, 31], terminal: session },
  {
    id: 'udf-boundary-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'udf-kinds',
        kind: 'table',
        label: 'Where each one runs',
        headers: ['', 'plan node', 'rows'],
        values: [
          ['built-in', 'Project', 'stay in the JVM'],
          ['@udf', 'BatchEvalPython', 'one by one'],
          ['@pandas_udf', 'ArrowEvalPython', 'in Arrow batches'],
        ],
      },
      {
        id: 'udf-facts',
        kind: 'list',
        icon: 'zap',
        label: 'Built-ins first',
        pattern: 'storage',
        items: [
          'A Python UDF is a black box the optimizer cannot see into',
          'Every row leaves the JVM and comes back',
          'pandas UDFs batch the trip with Arrow: far cheaper',
          'The built-in kept a DECIMAL; both UDFs returned doubles',
        ],
      },
    ],
  },
)
