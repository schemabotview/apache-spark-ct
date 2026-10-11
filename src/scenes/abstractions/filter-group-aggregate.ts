import type { Scene } from '@graphlearning/flow'

// §3.6 — the daily summary as DataFrame operations, with the result and the result types Spark
// 4.0.1 reported: count is a non-null long, and a sum over DECIMAL(10,2) widens to DECIMAL(20,2).
export const filterGroupAggregate: Scene = {
  id: 'filter-group-aggregate',
  title: 'Filter, group, aggregate',
  flow: 'TB',
  nodes: [
    {
      id: 'aggregate-code',
      kind: 'code',
      filename: 'daily_summary.py',
      label: `daily = (orders
    .where(F.col("status") == "COMPLETED")
    .groupBy("store_id")     # GroupedData
    .agg(F.count("*").alias("orders"),
         F.sum("amount").alias("sales"),
         F.round(F.avg("amount"), 2)
          .alias("avg_order"))
    .orderBy("store_id"))`,
    },
    {
      id: 'aggregate-results',
      label: 'Result and types',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'daily-rows',
          kind: 'table',
          label: 'daily.show()',
          sub: 'one row per store',
          headers: ['store_id', 'orders', 'sales', 'avg_order'],
          values: [
            ['7', '2', '65.00', '32.50'],
            ['9', '1', '15.00', '15.00'],
            ['12', '1', '80.00', '80.00'],
          ],
        },
        {
          id: 'daily-schema',
          kind: 'code',
          filename: 'daily.printSchema()',
          label: `root
 |-- store_id: integer (nullable = true)
 |-- orders: long (nullable = false)
 |-- sales: decimal(20,2) (nullable = true)
 |-- avg_order: decimal(11,2) (nullable = true)`,
        },
      ],
    },
  ],
  edges: [{ source: 'aggregate-code', target: 'aggregate-results' }],
}
