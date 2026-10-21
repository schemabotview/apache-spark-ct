import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/09-layout/project/perf/layout.py?raw'
import session from '../../../spine/fast/09-layout/session.txt?raw'

export const dataLayout: Scene = ideFrame(
  'data-layout',
  'retail-pipeline',
  fastTree(9),
  { file: 'perf/layout.py', code: code, show: [[13, 28]], highlight: [13, 14, 15, 21, 22, 23, 26, 28], terminal: session },
  {
    id: 'data-layout-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'layout-read',
        kind: 'table',
        label: 'One day of thirty',
        headers: ['layout', 'read', 'tasks'],
        values: [
          ['one folder', '91.6 MB', '4'],
          ['by day', '3.3 MB', '1'],
          ['2,000 small files', '347.8 MB', '63'],
        ],
      },
      {
        id: 'layout-facts',
        kind: 'list',
        icon: 'folder',
        label: 'Lay data out for how it is read',
        pattern: 'storage',
        items: [
          'partitionBy(day): a day’s query opens one folder',
          'Pruned before a single byte was read: 28× less',
          '2,000 files: 3.8× the bytes — random rows compress badly',
          'Small files also cost a listing and a footer each',
        ],
      },
    ],
  },
)
