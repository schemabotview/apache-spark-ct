import { projectTree } from '../project'

// retail-pipeline through Course 4: the data arrives in data/raw.
const BASE = ['conf/log4j2.properties', 'conf/spark-defaults.conf', 'jobs/daily_sales.py', 'requirements.txt']
const ORDERS = 'data/raw/orders/2026-10-01.json'
const STORES = 'data/raw/stores.csv'

export const readTree = (step: 1 | 2 | 3 | 4 | 5) =>
  projectTree(
    [...(step >= 2 ? [ORDERS] : []), ...(step >= 4 ? [STORES] : []), ...(step >= 5 ? ['data/tmp/orders/ Parquet'] : []), ...BASE],
    'jobs/daily_sales.py',
    step === 2 ? [ORDERS] : step === 4 ? [STORES] : step === 5 ? ['data/tmp/orders'] : [],
  )
