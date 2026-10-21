import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { correctTree } from './tree'
import code from '../../../spine/correct/02-malformed/project/pipeline/clean.py?raw'
import session from '../../../spine/correct/02-malformed/session.txt?raw'

export const malformedRecords: Scene = ideFrame(
  'malformed-records',
  'retail-pipeline',
  correctTree(2, 'pipeline/clean.py'),
  { file: 'pipeline/clean.py', code: code, highlight: [6, 8, 9, 10, 11, 13], terminal: session },
  {
    id: 'malformed-records-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'modes',
        kind: 'table',
        label: 'Read modes for a line that will not parse',
        headers: ['mode', 'a bad line becomes'],
        values: [
          ['PERMISSIVE', 'NULLs + _corrupt_record'],
          ['DROPMALFORMED', 'nothing: dropped'],
          ['FAILFAST', 'an error: job stops'],
        ],
      },
      {
        id: 'malformed-facts',
        kind: 'list',
        icon: 'ban',
        label: 'Keep the good, report the bad',
        pattern: 'warn',
        items: [
          'Never drop a row silently; never stop for one bad row',
          '_corrupt_record keeps the original text for the report',
          'problem says why, in words a person can act on',
          'o10 passed every check — with £1,250.00',
        ],
      },
    ],
  },
)
