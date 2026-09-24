import type { Scene } from '@graphlearning/flow'

// §10 serving — a CODE card. The query is short, so the card earns its height on the unionByName trap
// and on the three-line division of labour that IS the Lambda architecture.
export const capServing: Scene = {
  id: 'cap-serving',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'serving.py',
      minCols: 76,
      label: [
        'from pyspark.sql.functions import col, sum',
        '',
        'batch = spark.read.parquet("s3://lake/views/revenue")   # accurate',
        'rt    = spark.table("revenue_rt")                       # fresh',
        '',
        'answer = (batch.where(col("day") < today)        # history: batch',
        '    .unionByName(rt.where(col("day") == today))  # today: speed',
        '    .groupBy("category")',
        '    .agg(sum("revenue").alias("revenue")))',
        '',
        '# unionByName lines the columns up BY NAME -- plain union()',
        '# stacks by POSITION and would silently mis-map a reordered',
        '# schema.',
        '',
        '# the Lambda division of labour, in one query:',
        '#   batch layer    owns CORRECTNESS (complete, deduplicated)',
        '#   speed layer    owns LATENCY     (seconds fresh, partial)',
        '#   serving layer  owns THE ANSWER  (both of them, merged)',
        '',
        'answer.show()   # revenue by category, accurate AND up to now',
      ].join('\n'),
    },
  ],
  edges: [],
}
