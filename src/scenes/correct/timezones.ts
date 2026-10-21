import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { correctTree } from './tree'
import code from '../../../spine/correct/06-timezones/project/pipeline/summarise.py?raw'
import session from '../../../spine/correct/06-timezones/session.txt?raw'

export const shopDay: Scene = ideFrame(
  'shop-day',
  'retail-pipeline',
  correctTree(6, 'pipeline/summarise.py'),
  { file: 'pipeline/summarise.py', code: code, highlight: [5, 8, 10, 13, 14, 15], terminal: session },
  {
    id: 'shop-day-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'zones',
        kind: 'table',
        label: 'o15, at 2026-10-01 23:30 UTC',
        headers: ['read in', 'calendar day'],
        values: [
          ['UTC (the session)', '1 October'],
          ['Europe/London (BST)', '2 October'],
          ['America/New_York', '1 October'],
        ],
      },
      {
        id: 'tz-facts',
        kind: 'list',
        icon: 'clock',
        label: 'An instant has no calendar day',
        pattern: 'storage',
        items: [
          'TIMESTAMP is an instant; its day depends on a zone',
          'The session zone here is UTC — set it, never inherit it',
          'The business day is the shops’ day: Europe/London',
          'TIMESTAMP_NTZ is a wall-clock time with no zone at all',
        ],
      },
    ],
  },
)
