import type { Scene } from '@graphlearning/flow'

// §1.4 — the same multi-step job both ways: as two chained MapReduce jobs with a replicated-storage
// hop between them, and as one PySpark program that Spark plans as a whole. `stores` is a reference
// DataFrame assumed to be loaded already; the code is read, not run.
export const mapreduceVsSpark: Scene = {
  id: 'mapreduce-vs-spark',
  title: 'Chained jobs versus one plan',
  flow: 'LR',
  nodes: [
    {
      id: 'mapreduce-jobs',
      label: 'MapReduce: two chained jobs',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'mr-map', label: 'Job 1: map', sub: 'parse and filter', pattern: 'service', icon: 'funnel' },
        { id: 'mr-reduce', label: 'Job 1: reduce', sub: 'sum per store', pattern: 'service', icon: 'sigma' },
        { id: 'mr-hdfs', label: 'HDFS', sub: 'written, replicated', pattern: 'storage', icon: 'harddrive' },
        { id: 'mr-job-two', label: 'Job 2', sub: 'reads it back to join', pattern: 'service', icon: 'merge' },
      ],
      edges: [
        { source: 'mr-map', target: 'mr-reduce', label: 'shuffle' },
        { source: 'mr-reduce', target: 'mr-hdfs' },
        { source: 'mr-hdfs', target: 'mr-job-two' },
      ],
    },
    {
      id: 'spark-program',
      kind: 'code',
      filename: 'daily_summary.py',
      label: `from pyspark.sql import functions as F

daily = (spark.read.json("orders/")
         .where("status = 'COMPLETED'")
         .groupBy("store_id")
         .agg(F.sum("amount").alias("sales"))
         .join(stores, "store_id"))   # no storage hop

daily.write.parquet("sales_daily/")`,
    },
  ],
  edges: [{ source: 'mapreduce-jobs', target: 'spark-program' }],
}
