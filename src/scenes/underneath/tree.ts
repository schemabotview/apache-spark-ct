import { projectTree } from '../project'

// retail-pipeline in Course 7: three explorations beside the job, in explore/.
const REST = ['data/out/daily_sales/ day=…', 'data/raw/orders/2026-10-01.json', 'data/raw/orders/2026-10-02.json', 'data/raw/stores.csv', 'conf/log4j2.properties', 'conf/spark-defaults.conf', 'jobs/daily_sales.py', 'jobs/notify.py', 'requirements.txt']
const EXPLORE = ['explore/rdd_lineage.py', 'explore/pair_rdds.py', 'explore/closures.py']

export const underneathTree = (step: number) => {
  const file = EXPLORE[step - 1]
  return projectTree([...EXPLORE.slice(0, step), ...REST], file, step === 1 ? ['explore'] : [file])
}
