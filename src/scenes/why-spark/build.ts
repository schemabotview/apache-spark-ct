import type { Scene, SceneNode } from '@graphlearning/flow'

// The result table is a real PySpark 4.0.1 run of the finished batch logic over the six-order sample
// (DECIMAL amounts, completed orders only, joined to stores.csv) — the same rows Course 6 writes.
const step = (id: string, badge: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode =>
  ({ id, badge, label, sub, icon, pattern })
const course = (id: string, label: string): SceneNode => ({ id, label, variant: 'chip', pattern: 'user', icon: 'none' })

const EVENTS = [
  '{"order_id": "o1", "store_id": 7, "amount": "40.00",',
  ' "status": "COMPLETED", "event_time": "2026-10-01T09:01:00Z"}',
  '{"order_id": "o3", "store_id": 9, "amount": "60.00",',
  ' "status": "CANCELLED", "event_time": "2026-10-01T09:08:00Z"}',
  '… six events in the sample, ~200 GB a day in production',
].join('\n')

export const build: Scene = {
  id: 'retail-pipeline',
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'flow',
      label: 'The pipeline',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'sources',
          label: 'Sources',
          bare: true,
          children: [
            { id: 'events', kind: 'code', filename: 'data/raw/orders/2026-10-01.json', hug: true, pattern: 'storage', label: EVENTS },
            { id: 'stores', kind: 'table', label: 'data/raw/stores.csv', headers: ['store_id', 'city'], values: [['7', 'Leeds'], ['9', 'York'], ['12', 'Hull']] },
          ],
        },
        {
          id: 'job',
          label: 'jobs/daily_sales.py',
          sub: 'one Spark application',
          pattern: 'service',
          icon: 'spark',
          cols: 1,
          children: [
            step('read', '4', 'Read', 'JSON events and CSV stores, with a declared schema', 'file', 'service'),
            step('clean', '8', 'Clean', 'parse, validate, deduplicate; quarantine the bad', 'shieldcheck', 'service'),
            step('enrich', '5', 'Enrich', 'join each order to its store’s city', 'link', 'service'),
            step('summarise', '5', 'Summarise', 'completed sales per city and day', 'sigma', 'service'),
            step('write', '6', 'Write', 'Parquet, partitioned by day', 'harddrive', 'service'),
          ],
          edges: [
            { source: 'read', target: 'clean' },
            { source: 'clean', target: 'enrich' },
            { source: 'enrich', target: 'summarise' },
            { source: 'summarise', target: 'write' },
          ],
        },
        {
          id: 'out',
          label: 'Results',
          bare: true,
          children: [
            {
              id: 'result',
              kind: 'table',
              label: 'data/out/daily_sales/',
              headers: ['day', 'city', 'sales', 'orders'],
              values: [
                ['2026-10-01', 'Hull', '80.00', '1'],
                ['2026-10-01', 'Leeds', '65.00', '2'],
                ['2026-10-01', 'York', '15.00', '1'],
              ],
            },
            { id: 'live', label: 'jobs/live_sales.py', sub: 'the same summary as a stream, with watermarks — Course 11', icon: 'waves', pattern: 'network' },
          ],
        },
      ],
      edges: [
        { source: 'sources', target: 'job' },
        { source: 'job', target: 'out' },
      ],
    },
    {
      id: 'around',
      label: 'Around the pipeline',
      sub: 'Spark is SQL, DataFrames and Structured Streaming here; MLlib and GraphX are out of scope',
      pattern: 'user',
      icon: 'none',
      span: 'all',
      cols: 6,
      children: [
        course('c2', '2 · How Spark runs'),
        course('c3', '3 · Start the project'),
        course('c7', '7 · Look underneath'),
        course('c9', '9 · Read the plan'),
        course('c10', '10 · Make it fast'),
        course('c12', '12 · Ship it'),
      ],
    },
  ],
  edges: [],
}
