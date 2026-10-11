import type { Scene } from '@graphlearning/flow'

// §3.9 — what each source tells Spark about types, summarised from the dtypes 4.0.1 returned for the
// sample written as CSV, JSON and Parquet, beside a JDBC read whose partitioning options are easy to
// misread (the bounds set the stride, they do not filter).
export const readingSources: Scene = {
  id: 'reading-sources',
  title: 'Reading files and databases',
  flow: 'TB',
  nodes: [
    {
      id: 'file-reads',
      kind: 'code',
      filename: 'read_files.py',
      label: `spark.read.csv("orders.csv").dtypes
# _c0 … _c3, all string; header read as data

spark.read.json("orders_json/").dtypes
# amount: double, store_id: bigint
# (inferred from the values)

spark.read.parquet("orders_parquet/").dtypes
# amount: decimal(10,2), store_id: int
# (stored in the files)`,
    },
    {
      id: 'jdbc-read',
      kind: 'code',
      filename: 'read_jdbc.py',
      label: `stores = (spark.read.format("jdbc")
  .option("url", "jdbc:postgresql://db/retail")
  .option("dbtable", "stores")
  .option("partitionColumn", "store_id")
  .option("lowerBound", 1)
  .option("upperBound", 500)    # stride only
  .option("numPartitions", 4)   # 4 queries
  .load())`,
    },
  ],
  edges: [],
}
