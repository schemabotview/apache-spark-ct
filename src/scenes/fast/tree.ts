import { projectTree } from '../project'

// retail-pipeline in Course 10: tools/bench.py, and one measurement per section in perf/.
const PERF = ['baseline', 'stage_metrics', 'spill', 'partitions', 'repartition', 'joins', 'skew', 'cache', 'layout', 'aqe', 'cores', 'compare']
const REST = [
  'tools/make_orders.py', 'explore/planview.py', 'explore/plans.py', 'pipeline/summarise.py', 'pipeline/session.py', 'pipeline/clean.py',
  'data/gen/orders/ 10M orders', 'data/raw/orders/2026-10-01.json', 'jobs/daily_sales.py', 'conf/log4j2.properties', 'requirements.txt',
]

export function fastTree(step: number) {
  const perf = PERF.slice(0, step).map((f) => `perf/${f}.py`)
  const extra = step >= 7 ? ['data/gen/skewed/ store 7 = half'] : []
  const active = perf[perf.length - 1]
  const fresh = step === 1 ? ['tools/bench.py', 'perf/baseline.py'] : step === 7 ? [active, 'data/gen/skewed'] : [active]
  return projectTree([...perf, 'tools/bench.py', ...extra, ...REST], active, fresh, ['pipeline', 'jobs', 'conf', 'data/raw', 'explore'])
}
