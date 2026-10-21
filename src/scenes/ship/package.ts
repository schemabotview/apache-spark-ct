import type { Scene } from '@graphlearning/flow'
import { ideFrame, fold } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/01-package/project/ops/precedence.py?raw'
import session from '../../../spine/ship/01-package/session.txt?raw'

export const submitConfig: Scene = ideFrame(
  'submit-config',
  'retail-pipeline',
  shipTree(1),
  { file: 'ops/precedence.py', code: code, highlight: [7, 10, 13, 14, 15], terminal: fold(session, [1, 4], [-6, -1]) },
  {
    id: 'submit-config-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'precedence-table',
        kind: 'table',
        label: 'spark.sql.shuffle.partitions, three times',
        headers: ['set in', 'value', 'who wins'],
        values: [
          ['conf/spark-defaults.conf', '50', 'loses to both'],
          ['deploy/submit.sh --conf', '100', 'loses to code'],
          ['the builder, in code', '200', 'wins'],
        ],
      },
      {
        id: 'package-facts',
        kind: 'list',
        icon: 'package',
        label: 'Shipping a PySpark job',
        pattern: 'storage',
        items: [
          'spark-submit starts the driver: the job is a file, not a REPL',
          '--py-files ships pipeline/ as a zip to every executor',
          'Settings: code, then flags, then spark-defaults.conf',
          'Keep cluster settings out of code, so ops can change them',
        ],
      },
    ],
  },
)
