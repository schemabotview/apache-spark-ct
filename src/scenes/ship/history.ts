import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/06-history/project/ops/history.py?raw'
import session from '../../../spine/ship/06-history/session.txt?raw'

export const observabilityPath: Scene = ideFrame(
  'observability-path',
  'retail-pipeline',
  shipTree(6),
  { file: 'ops/history.py', code: code, show: [[13, 27]], highlight: [13, 17, 18], terminal: session },
  {
    id: 'observability-path-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'history-table',
        kind: 'table',
        label: 'Where to look, and when',
        headers: ['source', 'while running', 'after it ends'],
        values: [
          ['web UI, port 4040', 'yes', 'no: gone'],
          ['event log', 'being written', 'kept'],
          ['history server', '', 'reads the logs'],
          ['driver/executor logs', 'yes', 'if collected'],
        ],
      },
      {
        id: 'history-facts',
        kind: 'list',
        icon: 'search',
        label: 'Diagnosing a run after it ended',
        pattern: 'storage',
        items: [
          'spark.eventLog.enabled: every run leaves a log',
          'The history server serves it as the same UI and API',
          '1,014 tasks for 180 rows: too many partitions',
          'Compare runs: tasks, spill, shuffle, failed attempts',
        ],
      },
    ],
  },
)
