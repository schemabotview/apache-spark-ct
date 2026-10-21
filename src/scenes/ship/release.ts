import type { Scene } from '@graphlearning/flow'
import { ideFrame, fold } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/11-release/project/deploy/release.sh?raw'
import session from '../../../spine/ship/11-release/session.txt?raw'

export const productionReview: Scene = ideFrame(
  'production-review',
  'retail-pipeline',
  shipTree(11),
  { file: 'deploy/release.sh', code: code, highlight: [4, 6, 7], terminal: fold(session, [1, 13]) },
  {
    id: 'production-review-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'decisions-table',
        kind: 'table',
        label: 'Every decision, and where it was made',
        headers: ['decision', 'course'],
        values: [
          ['explicit schemas, amount as text', '4, 8'],
          ['one row per order: latest wins', '8'],
          ['shop days in Europe/London', '8'],
          ['quality checks before any write', '8'],
          ['measured, not guessed, tuning', '10'],
          ['dedupe within the watermark', '11'],
          ['package, test, then submit', '12'],
        ],
      },
      {
        id: 'risk-list',
        kind: 'list',
        icon: 'search',
        label: 'Open risks',
        pattern: 'storage',
        items: [
          'Plain Parquet output: a failed overwrite loses a day',
          'No authentication or encryption turned on yet',
          'Shuffle partitions fixed at 100: wrong for 200 GB',
          'Late orders are dropped by design: tell the business',
        ],
      },
    ],
  },
)
