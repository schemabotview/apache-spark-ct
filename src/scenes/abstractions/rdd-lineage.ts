import type { Scene } from '@graphlearning/flow'

// §3.1 — an RDD pipeline over the six-row orders sample, and its lineage as Spark 4.0.1 prints it
// (run locally with local[2]; file paths trimmed). PySpark fuses the consecutive Python filter/map
// steps into one PythonRDD, which is why the lineage is shorter than the code.
export const rddLineage: Scene = {
  id: 'rdd-lineage',
  title: 'An RDD and its lineage',
  flow: 'TB',
  nodes: [
    {
      id: 'rdd-code',
      kind: 'code',
      filename: 'orders_rdd.py',
      label: `lines = sc.textFile("orders.csv")
header = lines.first()          # action
rows = (lines.filter(lambda l: l != header)
             .map(lambda l: l.split(",")))
completed = rows.filter(
    lambda r: r[3] == "COMPLETED")

completed.count()               # action → 4
completed.getNumPartitions()    # 2`,
    },
    {
      id: 'rdd-debug-string',
      kind: 'code',
      filename: 'completed.toDebugString()',
      label: `(2) PythonRDD[4] at RDD at PythonRDD.scala:56
 |  orders.csv MapPartitionsRDD[1] at textFile
 |  orders.csv HadoopRDD[0] at textFile`,
    },
  ],
  edges: [{ source: 'rdd-code', target: 'rdd-debug-string', label: 'lineage' }],
}
