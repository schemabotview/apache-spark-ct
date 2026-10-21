import type { Scene } from '@graphlearning/flow'
import { ideFrame, fold } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/05-tests/project/tests/test_pipeline.py?raw'
import session from '../../../spine/ship/05-tests/session.txt?raw'

export const qualityChecks: Scene = ideFrame(
  'quality-checks',
  'retail-pipeline',
  shipTree(5),
  { file: 'tests/test_pipeline.py', code: code, show: [[14, 28]], highlight: [14, 15, 19, 20], terminal: fold(session, [1, 1], [8, -1]) },
  {
    id: 'quality-checks-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'tests-table',
        kind: 'table',
        label: 'Each test is a Course 8 failure',
        headers: ['test', 'the failure it guards'],
        values: [
          ['comma amount', '"12,50" read as 1250.00'],
          ['good amount', 'DECIMAL keeps pennies'],
          ['resend counts once', 'o4 sent twice'],
          ['unknown store', 'o7 at store 15'],
          ['repeated store', 'join doubles orders'],
        ],
      },
      {
        id: 'tests-facts',
        kind: 'list',
        icon: 'circlecheck',
        label: 'Testing PySpark',
        pattern: 'storage',
        items: [
          'One local SparkSession per run: a fixture in conftest.py',
          'Tiny DataFrames built in the test, not files',
          'Test the pipeline\'s functions, not whole jobs',
          'The quality checks still run in production, on real data',
        ],
      },
    ],
  },
)
