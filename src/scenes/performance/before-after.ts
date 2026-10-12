import type { Scene } from '@graphlearning/flow'

// §6.12 — one daily-sales query (city × day) improved one change at a time, each step measured five
// times on local[4] with the checksum unchanged. Tasks and shuffle bytes are summed over the query's
// stages from the monitoring REST API.
export const beforeAfter: Scene = {
  id: 'before-after',
  title: 'Before and after, one change at a time',
  flow: 'TB',
  nodes: [
    {
      id: 'steps-table',
      kind: 'table',
      label: 'sales by city and day, 10,000,000 orders',
      sub: 'median of 5 · checksum constant',
      headers: ['change', 'join', 'tasks', 'shuffled', 'median'],
      values: [
        ['before', 'SortMerge', '4,065', '65.4 MB', '10.98 s'],
        ['+ allow broadcast', 'BroadcastHash', '2,065', '7.5 MB', '5.54 s'],
        ['+ AQE on', 'BroadcastHash', '68', '3.4 MB', '2.95 s'],
        ['+ 32 files', 'BroadcastHash', '7', '0.2 MB', '0.98 s'],
      ],
    },
    {
      id: 'checksum-card',
      kind: 'code',
      filename: 'starting point and checksum',
      label: `# before: 2,000 small files, AQE off,
#   2,000 shuffle partitions, no broadcast
rows 1,500 · orders 8,000,464
sales 368,061,489.09
# before-runs ranged 9.82–13.76 s: report
# the median and the spread`,
    },
  ],
  edges: [{ source: 'steps-table', target: 'checksum-card' }],
}
