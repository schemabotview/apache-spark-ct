import type { Scene } from '@graphlearning/flow'

// §3.10 — a partitioned Parquet write and the directory Spark 4.0.1 produced for the sample (file
// uuids elided), plus the error a second write raises under the default save mode.
export const writeOutput: Scene = {
  id: 'write-output',
  title: 'What a write produces',
  flow: 'TB',
  nodes: [
    {
      id: 'write-code',
      kind: 'code',
      filename: 'write_orders.py',
      label: `(orders.write
    .mode("overwrite")
    .partitionBy("status")
    .parquet("out/by_status"))

# default mode: errorifexists
orders.write.parquet("out/by_status")
# AnalysisException: [PATH_ALREADY_EXISTS]
#   Path … already exists`,
    },
    {
      id: 'write-tree',
      kind: 'code',
      filename: 'out/by_status/',
      label: `_SUCCESS
status=CANCELLED/
    part-00000-….c000.snappy.parquet
status=COMPLETED/
    part-00000-….c000.snappy.parquet
status=PENDING/
    part-00000-….c000.snappy.parquet`,
    },
  ],
  edges: [{ source: 'write-code', target: 'write-tree', label: 'produces' }],
}
