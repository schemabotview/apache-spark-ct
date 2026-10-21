import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { readTree } from './tree'
import code from '../../../spine/read/04-csv/project/jobs/daily_sales.py?raw'
import session from '../../../spine/read/04-csv/session.txt?raw'

export const readCsv: Scene = ideFrame(
  'read-csv',
  'retail-pipeline',
  readTree(4),
  { file: 'jobs/daily_sales.py', code, show: [[13, 28]], highlight: [18, 19, 20, 21, 25], terminal: session },
  {
    id: 'read-csv-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'csv-options',
        kind: 'table',
        label: 'CSV options that matter',
        headers: ['option', 'default', 'here'],
        values: [
          ['header', 'false', 'true'],
          ['inferSchema', 'false', '— (a schema)'],
          ['sep', ',', ','],
          ['mode', 'PERMISSIVE', 'PERMISSIVE'],
          ['nullValue', '""', '""'],
        ],
      },
      {
        id: 'csv-facts',
        kind: 'list',
        icon: 'file',
        label: 'CSV knows nothing about types',
        pattern: 'storage',
        items: [
          'Without header, the first line is data: _c0, _c1',
          'Without a schema, every column is a string',
          'The header supplies names only — the schema the types',
        ],
      },
    ],
  },
)
