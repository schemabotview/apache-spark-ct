import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { transformTree } from './tree'
import code from '../../../spine/transform/02-functions/project/jobs/daily_sales.py?raw'
import session from '../../../spine/transform/02-functions/session.txt?raw'

export const builtInFunctions: Scene = ideFrame(
  'built-in-functions',
  'retail-pipeline',
  transformTree(),
  { file: 'jobs/daily_sales.py', code, show: [[19, 33]], highlight: [24, 25, 26, 27, 28], terminal: session },
  {
    id: 'built-in-functions-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'fns',
        kind: 'table',
        label: 'Built-ins used here',
        headers: ['function', 'gives'],
        values: [['to_date(ts)', 'the calendar day'], ['hour(ts)', '0 – 23'], ['lower(s)', 'lower-case text'], ['when(c, x).otherwise(y)', 'x where c is true, else y']],
      },
      {
        id: 'built-in-functions-facts',
        kind: 'list',
        icon: 'wrench',
        label: 'Stay inside the engine',
        pattern: 'storage',
        items: ['pyspark.sql.functions has hundreds of them', 'They run in the JVM: no Python per row', 'when() without otherwise() gives NULL', 'Times are read in the session time zone: UTC here'],
      },
    ],
  },
)
