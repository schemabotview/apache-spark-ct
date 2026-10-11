import type { Scene } from '@graphlearning/flow'

// §2.1 — the whole local application in one code card, above its four lifecycle steps. The schema
// is explicit on purpose: without it, reading JSON scans the input to infer one (§2.4's contrast).
export const localAppLifecycle: Scene = {
  id: 'local-app-lifecycle',
  title: 'A small Spark application',
  flow: 'TB',
  nodes: [
    {
      id: 'daily-sales-app',
      kind: 'code',
      filename: 'daily_sales.py',
      label: `from pyspark.sql import SparkSession, functions as F

spark = (SparkSession.builder
         .appName("daily-sales")
         .master("local[4]")
         .getOrCreate())

orders = (spark.read
          .schema("order_id STRING, store_id INT, "
                  "amount DECIMAL(10,2), status STRING")
          .json("orders/2026-10-01/"))

daily = (orders.where(F.col("status") == "COMPLETED")
         .groupBy("store_id")
         .agg(F.sum("amount").alias("sales")))

daily.write.mode("overwrite").parquet("out/daily_sales/")
spark.stop()`,
    },
    {
      id: 'app-lifecycle',
      label: 'Lifecycle',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'start-session', label: 'Start', sub: 'getOrCreate starts the driver', badge: '01', pattern: 'service', icon: 'power' },
        { id: 'declare-plan', label: 'Declare', sub: 'read, where, groupBy build a plan', badge: '02', pattern: 'service', icon: 'workflow' },
        { id: 'run-action', label: 'Run', sub: 'write is the action that runs it', badge: '03', pattern: 'service', icon: 'zap' },
        { id: 'stop-session', label: 'Stop', sub: 'stop releases the resources', badge: '04', pattern: 'service', icon: 'circleslash' },
      ],
    },
  ],
  edges: [],
}
