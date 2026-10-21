import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { correctTree } from './tree'
import code from '../../../spine/correct/01-schema-evolution/project/jobs/daily_sales.py?raw'
import session from '../../../spine/correct/01-schema-evolution/session.txt?raw'

export const schemaEvolution: Scene = ideFrame(
  'schema-evolution',
  'retail-pipeline',
  correctTree(1, 'jobs/daily_sales.py'),
  { file: 'jobs/daily_sales.py', code: code, highlight: [4, 5, 7, 9, 12, 13], terminal: session },
  {
    id: 'schema-evolution-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'evolve',
        kind: 'table',
        label: 'Changing a schema safely',
        headers: ['change', 'old data reads'],
        values: [
          ['add a nullable column', 'NULL — safe'],
          ['drop a column', 'fine; it is ignored'],
          ['rename a column', 'NULL under the new name'],
          ['change a type', 'fails or corrupts'],
        ],
      },
      {
        id: 'evolution-facts',
        kind: 'list',
        icon: 'layers',
        label: 'The package arrives',
        pattern: 'storage',
        items: [
          'pipeline/session.py: one way to build a session',
          'pipeline/schemas.py: every input’s shape, in one place',
          'python -m jobs.daily_sales: run from the root, so pipeline imports',
          'Parquet can merge file schemas with mergeSchema',
        ],
      },
    ],
  },
)
