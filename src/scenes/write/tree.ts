import { projectTree } from '../project'

// retail-pipeline through Course 6: a second day arrives, and data/out/ fills.
const RAW = ['data/raw/orders/2026-10-01.json', 'data/raw/stores.csv']
const DAY2 = 'data/raw/orders/2026-10-02.json'
const REST = ['conf/log4j2.properties', 'conf/spark-defaults.conf', 'jobs/daily_sales.py', 'requirements.txt']

export function writeTree(step: number, active = 'jobs/daily_sales.py') {
  const out = step === 1 ? ['data/out/daily_sales/ Parquet'] : step === 4 ? ['data/out/sent.log'] : step >= 2 ? ['data/out/daily_sales/ day=…'] : []
  const notify = step >= 4 ? ['jobs/notify.py'] : []
  const fresh = step === 1 ? ['data/out'] : step === 2 ? [DAY2, 'data/out/daily_sales'] : step === 4 ? ['jobs/notify.py', 'data/out/sent.log'] : []
  return projectTree([...out, ...RAW, ...(step >= 2 ? [DAY2] : []), ...REST, ...notify], active, fresh)
}
