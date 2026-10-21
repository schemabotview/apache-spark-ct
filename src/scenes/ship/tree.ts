import { projectTree } from '../project'

// retail-pipeline in Course 12: deploy/ (how it is packaged, submitted and run), ops/ (one
// production question per section), tests/. Everything built before sits closed with a count, so
// the explorer stays inside its pane.
const ADDS: string[][] = [
  ['deploy/package.sh', 'deploy/submit.sh', 'ops/precedence.py', 'conf/spark-defaults.conf'],
  ['ops/where.py'],
  ['deploy/standalone.sh'],
  ['tools/capacity.py'],
  ['tests/conftest.py', 'tests/test_pipeline.py', 'pytest.ini', 'requirements.txt'],
  ['deploy/history.sh', 'ops/history.py', 'conf/spark-defaults.conf'],
  ['ops/retries.py'],
  ['ops/overwrite.py'],
  ['ops/backfill.py'],
  ['ops/secrets.py'],
  ['deploy/release.sh'],
]
// the file each section opens in the editor
const OPEN = ['ops/precedence.py', 'ops/where.py', 'deploy/standalone.sh', 'tools/capacity.py', 'tests/test_pipeline.py', 'ops/history.py',
  'ops/retries.py', 'ops/overwrite.py', 'ops/backfill.py', 'ops/secrets.py', 'deploy/release.sh']
const REST = [
  'conf/log4j2.properties', 'jobs/daily_sales.py', 'jobs/live_sales.py', 'jobs/notify.py', 'pipeline/clean.py', 'pipeline/enrich.py',
  'pipeline/quality.py', 'pipeline/schemas.py', 'pipeline/session.py', 'pipeline/summarise.py', 'tools/bench.py', 'tools/feed.py',
  'tools/make_orders.py', 'data/ raw, stream, events', 'stream/ 11 files', 'perf/ 12 files', 'explore/ 13 files',
]

export function shipTree(step: number) {
  const added = [...new Set(ADDS.slice(0, step).flat())].filter((p) => !REST.includes(p))
  const active = OPEN[step - 1]
  const fresh = ADDS[step - 1].map((p) => (p.startsWith('conf/') ? 'conf' : p))
  const shut = ['pipeline', 'jobs', 'conf', 'tools', 'tests'].filter((d) => !fresh.some((p) => p === d || p.startsWith(`${d}/`)))
  return projectTree([...added, ...REST], active, fresh, shut)
}
