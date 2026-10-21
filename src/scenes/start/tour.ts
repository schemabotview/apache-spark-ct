import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'

// The finished project as docs/APACHE-SPARK-COURSE-PLAN.md describes it. Nothing here runs yet —
// this frame is the map, so the editor's place holds what each part is for, not code.
export const projectTour: Scene = ideFrame(
  'project-tour',
  'retail-pipeline',
  [
    { name: '.venv', folder: true, state: 'muted', note: 'Python + PySpark' },
    { name: 'conf', children: [{ name: 'log4j2.properties' }, { name: 'spark-defaults.conf' }] },
    {
      name: 'data',
      children: [
        { name: 'raw', children: [{ name: 'orders', folder: true, note: 'one file a day' }, { name: 'stores.csv' }] },
        { name: 'out', children: [{ name: 'daily_sales', folder: true, note: 'Parquet' }] },
      ],
    },
    { name: 'jobs', children: [{ name: 'daily_sales.py', state: 'active' }, { name: 'live_sales.py' }] },
    {
      name: 'pipeline',
      children: [{ name: 'session.py' }, { name: 'schemas.py' }, { name: 'clean.py' }, { name: 'enrich.py' }, { name: 'summarise.py' }, { name: 'quality.py' }],
    },
    { name: 'tools', children: [{ name: 'make_orders.py' }] },
    { name: 'tests', folder: true, note: 'pytest' },
    { name: 'requirements.txt' },
    { name: 'submit.sh' },
  ],
  {
    id: 'parts',
    kind: 'table',
    label: 'What each part is for, and where we build it',
    headers: ['part', 'its job', 'course'],
    values: [
      ['.venv/, requirements.txt', 'its own Python, and PySpark', '3'],
      ['conf/', 'Spark’s logging and defaults', '3, 12'],
      ['data/raw/', 'order events and stores', '4'],
      ['data/out/', 'the summary, partitioned by day', '6'],
      ['jobs/daily_sales.py', 'the batch job we run', '3 → 7'],
      ['jobs/live_sales.py', 'the same, as a stream', '11'],
      ['pipeline/', 'the rules, split into modules', '8'],
      ['quality.py', 'invariants every run must meet', '8 → 12'],
      ['tools/make_orders.py', 'millions of orders, for timings', '9 → 10'],
      ['tests/', 'checks run on every change', '12'],
      ['submit.sh', 'spark-submit, packaged', '12'],
    ],
  },
  {
    id: 'legend',
    kind: 'list',
    icon: 'folder',
    label: 'Reading every lesson',
    sub: 'the same panels, always',
    pattern: 'network',
    items: [
      'Left: the project, as your editor shows it',
      'NEW marks a file this lesson adds',
      'The highlighted file is the one open in the editor',
      'Centre: the code, this lesson’s lines highlighted',
      'Below it: the terminal, exactly as it really ran',
      '··· N lines folds what this lesson does not need',
    ],
  },
)
