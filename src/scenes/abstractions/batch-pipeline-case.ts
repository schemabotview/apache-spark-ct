import type { Scene } from '@graphlearning/flow'

// §3.12 — the chapter's pieces as one pipeline over the sample: filter, join to stores, aggregate by
// city, order. Both tables are exactly what Spark 4.0.1 returned.
export const batchPipelineCase: Scene = {
  id: 'batch-pipeline-case',
  title: 'A small batch pipeline, end to end',
  flow: 'TB',
  nodes: [
    {
      id: 'pipeline-code',
      kind: 'code',
      filename: 'sales_by_city.py',
      label: `stores = (spark.read.option("header", True)
          .schema("store_id INT, city STRING")
          .csv("stores.csv"))

result = (orders
          .where(F.col("status") == "COMPLETED")
          .join(stores, "store_id")
          .groupBy("city")
          .agg(F.count("*").alias("orders"),
               F.sum("amount").alias("sales"))
          .orderBy(F.desc("sales")))`,
    },
    {
      id: 'pipeline-tables',
      label: 'Input and expected result',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'stores-table',
          kind: 'table',
          label: 'stores',
          sub: 'reference data',
          headers: ['store_id', 'city'],
          values: [
            ['7', 'Leeds'],
            ['9', 'York'],
            ['12', 'Hull'],
          ],
        },
        {
          id: 'result-table',
          kind: 'table',
          label: 'result.show()',
          sub: 'sales by city',
          headers: ['city', 'orders', 'sales'],
          values: [
            ['Hull', '1', '80.00'],
            ['Leeds', '2', '65.00'],
            ['York', '1', '15.00'],
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'pipeline-code', target: 'pipeline-tables' }],
}
