import { projectTree } from '../project'

// retail-pipeline in Course 11: tools/feed.py plays four event files into data/stream/in, and each
// section adds one script to stream/. Section 3 is a concept frame, so it has no entry; step 13 adds
// the job itself, jobs/live_sales.py.
const STREAM = ['incremental', 'progress', '', 'triggers', 'event_time', 'windows', 'watermark', 'state', 'output_modes', 'joins', 'checkpoint', 'delivery']
const REST = [
  'tools/feed.py', 'tools/bench.py', 'tools/make_orders.py', 'data/stream/arriving/ 4 event files', 'pipeline/session.py', 'pipeline/clean.py', 'pipeline/schemas.py',
  'pipeline/enrich.py', 'pipeline/summarise.py', 'pipeline/quality.py', 'jobs/daily_sales.py', 'jobs/notify.py', 'data/raw/stores.csv', 'perf/', 'explore/', 'conf/log4j2.properties', 'requirements.txt',
]

export function streamTree(step: number) {
  const files = STREAM.slice(0, step).filter(Boolean).map((f) => `stream/${f}.py`)
  const payments = step >= 10 ? ['data/stream/payments/payments.json'] : []
  const job = step >= 13 ? ['jobs/live_sales.py'] : []
  const active = step >= 13 ? 'jobs/live_sales.py' : files[files.length - 1]
  const fresh =
    step === 1 ? [active, 'tools/feed.py', 'data/stream/arriving', 'pipeline/session.py'] : step === 10 ? [active, 'data/stream/payments'] : [active]
  // the last step opens jobs/, so the eleven scripts in stream/ fold away to keep the explorer in its pane
  const folded = step >= 13 ? ['stream', 'data/stream/payments'] : []
  return projectTree([...files, ...payments, ...job, ...REST], active, fresh, ['pipeline', 'jobs', 'conf', 'data/raw', ...folded])
}
