import { projectTree } from '../project'

// retail-pipeline in Course 9: generated data in data/gen/, and one exploration per section.
const EXPLORE = ['planview.py', 'plans.py', 'analysis.py', 'joins.py', 'codegen.py', 'stages.py', 'trace.py']
const REST = [
  'pipeline/clean.py', 'pipeline/enrich.py', 'pipeline/quality.py', 'pipeline/schemas.py', 'pipeline/session.py', 'pipeline/summarise.py',
  'data/raw/orders/2026-10-01.json', 'data/raw/stores.csv', 'data/out/daily_sales/ day=…', 'jobs/daily_sales.py', 'jobs/notify.py',
  'conf/log4j2.properties', 'conf/spark-defaults.conf', 'requirements.txt',
]

export function plansTree(step: number, active: string) {
  const explore = EXPLORE.slice(0, step + 1).map((f) => `explore/${f}`)
  const paths = ['data/gen/orders/ 8 Parquet files', 'data/gen/stores/ CSV', 'tools/make_orders.py', ...explore, ...REST]
  const fresh = step === 1 ? ['tools', 'data/gen', 'explore/planview.py', 'explore/plans.py'] : [`explore/${EXPLORE[step]}`]
  return projectTree(paths, active, fresh, ['pipeline', 'jobs', 'conf', 'data/raw', 'data/out'])
}
