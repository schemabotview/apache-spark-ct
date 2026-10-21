import { projectTree } from '../project'

// retail-pipeline through Course 5: inputs in data/raw; from §7 a table in spark-warehouse/.
const FILES = ['data/raw/orders/2026-10-01.json', 'data/raw/stores.csv', 'conf/log4j2.properties', 'conf/spark-defaults.conf', 'jobs/daily_sales.py', 'requirements.txt']

export const transformTree = (warehouse = false) =>
  projectTree(warehouse ? ['spark-warehouse/daily_sales/ Parquet', ...FILES] : FILES, 'jobs/daily_sales.py', warehouse ? ['spark-warehouse'] : [])
