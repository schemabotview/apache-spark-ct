import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import code from '../../../spine/why-spark/01-workload/project/day_summary.py?raw'
import session from '../../../spine/why-spark/01-workload/session.txt?raw'

// The six-order sample in pandas (pandas 2.3.3). The byte counts are a real run over that file; the
// 200 GB line is the script's own arithmetic on them, and the side pane's timings are the course's
// fixed assumption of a 2 GB/s scan per machine (docs/APACHE-SPARK-COURSE-PLAN.md).
export const workload: Scene = ideFrame(
  'workload-limits',
  'why-spark',
  [
    { name: '.venv', folder: true, state: 'muted', note: 'pandas' },
    { name: 'day_summary.py', state: 'active' },
    { name: 'orders.json', note: 'six events' },
  ],
  { file: 'day_summary.py', code, highlight: [6, 13, 14, 18], pattern: 'network', terminal: session },
  {
    id: 'workload-limits-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'scale',
        kind: 'table',
        label: 'The real workload, on one machine',
        headers: ['', 'size', 'one scan at 2 GB/s'],
        values: [
          ['the sample', '683 bytes', 'instant'],
          ['one day', '~200 GB', '~100 s'],
          ['one year', '~70 TB', '~10 hours'],
          ['one year, 50 machines', '~1.4 TB each', '~12 minutes'],
        ],
      },
      {
        id: 'limits',
        kind: 'list',
        icon: 'gauge',
        label: 'Distribute only when one machine fails',
        pattern: 'warn',
        items: [
          'Memory: the day must fit in RAM to be loaded at all',
          'Time: a year’s backfill must finish inside its window',
          'Growth: next year’s data is larger than this year’s',
          'If it fits on one machine, one machine is simpler and faster',
        ],
      },
    ],
  },
)
