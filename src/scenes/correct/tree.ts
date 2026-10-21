import { projectTree } from '../project'

// retail-pipeline through Course 8: the job becomes a package, step by step.
const ADDS: Record<number, string[]> = {
  1: ['pipeline/__init__.py', 'pipeline/session.py', 'pipeline/schemas.py', 'data/raw/orders/2026-10-03.json'],
  2: ['pipeline/clean.py'],
  3: ['explore/casts.py'],
  4: ['pipeline/enrich.py'],
  6: ['pipeline/summarise.py'],
  7: ['data/raw/baskets/2026-10-01.json', 'explore/nested.py'],
  8: ['explore/udfs.py'],
  9: ['pipeline/quality.py', 'data/out/rejected/ JSON'],
}
const BASE = [
  'data/out/daily_sales/ day=…', 'data/raw/orders/2026-10-01.json', 'data/raw/orders/2026-10-02.json', 'data/raw/stores.csv',
  'conf/log4j2.properties', 'conf/spark-defaults.conf', 'explore/rdd_lineage.py', 'explore/pair_rdds.py', 'explore/closures.py',
  'jobs/daily_sales.py', 'jobs/notify.py', 'requirements.txt',
]
// files this step CHANGED, marked like new ones so the eye finds them
const CHANGED: Record<number, string[]> = { 2: ['data/raw/orders/2026-10-01.json'], 4: ['data/raw/stores.csv'] }

export function correctTree(step: number, active: string) {
  const added = Object.entries(ADDS).filter(([s]) => Number(s) <= step).flatMap(([, files]) => files)
  const order = (p: string) => (p.startsWith('pipeline') ? 0 : 1)
  const paths = [...added, ...BASE].sort((a, b) => order(a) - order(b))
  return projectTree(paths, active, [...(ADDS[step] ?? []).map((p) => p.split(' ')[0].replace(/\/$/, '')), ...(CHANGED[step] ?? [])], ['conf', 'explore', 'jobs', 'data/out'])
}
