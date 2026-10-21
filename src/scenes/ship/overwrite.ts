import type { Scene } from '@graphlearning/flow'
import { ideFrame, fold } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/08-table-formats/project/ops/overwrite.py?raw'
import session from '../../../spine/ship/08-table-formats/session.txt?raw'

export const tableFormatBoundary: Scene = ideFrame(
  'table-format-boundary',
  'retail-pipeline',
  shipTree(8),
  { file: 'ops/overwrite.py', code: code, show: [[9, 24]], highlight: [10, 11, 17, 20], terminal: fold(session, [1, 4], [-3, -1]) },
  {
    id: 'table-format-boundary-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'format-table',
        kind: 'table',
        label: 'A Parquet folder against a table format',
        headers: ['guarantee', 'Parquet folder', 'table format'],
        values: [
          ['an overwrite is atomic', 'no', 'yes'],
          ['readers see old or new', 'no', 'yes'],
          ['go back to a version', 'no', 'yes'],
          ['update or merge rows', 'rewrite all', 'MERGE'],
          ['writers coordinate', 'no', 'yes'],
        ],
      },
      {
        id: 'format-facts',
        kind: 'list',
        icon: 'layers',
        label: 'What a table format adds',
        pattern: 'storage',
        items: [
          'A log of commits beside the files: Delta, Iceberg, Hudi',
          'A write is visible only when its commit lands',
          'So a failed write leaves the last version readable',
          'Not covered here: each format\'s internals',
        ],
      },
    ],
  },
)
