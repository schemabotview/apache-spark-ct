import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { readTree } from './tree'
import code from '../../../spine/read/02-json/project/jobs/daily_sales.py?raw'
import session from '../../../spine/read/02-json/session.txt?raw'

export const readJson: Scene = ideFrame(
  'read-json',
  'retail-pipeline',
  readTree(2),
  { file: 'jobs/daily_sales.py', code, show: [[13, 19]], highlight: [13, 14, 17], terminal: session },
  {
    id: 'read-json-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'inferred',
        kind: 'table',
        label: 'What inference guessed',
        headers: ['column', 'guessed', 'we mean'],
        values: [
          ['amount', 'double', 'decimal(10,2)'],
          ['event_time', 'string', 'timestamp'],
          ['store_id', 'long', 'int'],
          ['order', 'by name', 'as in the file'],
        ],
      },
      {
        id: 'json-facts',
        kind: 'list',
        icon: 'search',
        label: 'Inference reads the data first',
        pattern: 'warn',
        items: [
          'One JSON object per line: each line is a row',
          'Job 0 ran before any action — the scan for the schema',
          'On 200 GB a day, that is a full extra pass',
          'Another day’s file can guess differently',
        ],
      },
    ],
  },
)
