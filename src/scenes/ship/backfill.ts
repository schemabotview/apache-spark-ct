import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/09-backfill/project/ops/backfill.py?raw'
import session from '../../../spine/ship/09-backfill/session.txt?raw'

export const backfillOverwrite: Scene = ideFrame(
  'backfill-overwrite',
  'retail-pipeline',
  shipTree(9),
  { file: 'ops/backfill.py', code: code, show: [[6, 21]], highlight: [15, 16, 17], terminal: session },
  {
    id: 'backfill-overwrite-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'backfill-table',
        kind: 'table',
        label: 'Re-writing 2026-10-02',
        headers: ['overwrite mode', 'days left', 'result'],
        values: [
          ['static (default)', '1 of 3', '10-01, 10-03 deleted'],
          ['dynamic', '3 of 3', 'only 10-02 replaced'],
        ],
      },
      {
        id: 'release-facts',
        kind: 'list',
        icon: 'shieldcheck',
        label: 'A safe backfill or release',
        pattern: 'storage',
        items: [
          'Dynamic overwrite for partition backfills',
          'Write to a new path or table version, then switch',
          'Add columns; never change a column\'s meaning in place',
          'Keep the last good output until the new one is checked',
        ],
      },
    ],
  },
)
