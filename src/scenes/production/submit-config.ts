import type { Scene } from '@graphlearning/flow'

// §8.1 — submitting the daily job with its Python environment and a setting given in three places:
// the value set in code wins over a spark-submit flag, which wins over spark-defaults.conf.
export const submitConfig: Scene = {
  id: 'submit-config',
  title: 'Packaging and configuration',
  flow: 'TB',
  nodes: [
    {
      id: 'submit-code',
      kind: 'code',
      filename: 'submit_daily_sales.sh',
      label: `# venv-pack -o pyspark_venv.tar.gz  (once, in CI)
export PYSPARK_PYTHON=./environment/bin/python
spark-submit \\
  --master yarn --deploy-mode cluster \\
  --archives pyspark_venv.tar.gz#environment \\
  --py-files retail_lib.zip \\
  --conf spark.sql.shuffle.partitions=300 \\
  daily_sales.py --date 2026-10-01`,
    },
    {
      id: 'precedence-table',
      kind: 'table',
      label: 'One setting, three places',
      sub: 'spark.sql.shuffle.partitions',
      headers: ['set in', 'value', 'used?'],
      values: [
        ['spark-defaults.conf', '400', 'no'],
        ['spark-submit --conf', '300', 'no'],
        ['SparkSession builder', '200', 'yes — code wins'],
      ],
    },
  ],
  edges: [{ source: 'submit-code', target: 'precedence-table' }],
}
