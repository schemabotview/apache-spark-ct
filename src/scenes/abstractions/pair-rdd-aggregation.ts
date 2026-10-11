import type { Scene } from '@graphlearning/flow'

// §3.2 — key-value aggregation on the sample, with real results: reduceByKey combines inside each
// partition before the shuffle, groupByKey ships every value. The lineage card shows the shuffle as
// the ShuffledRDD and the `+-(2)` indent that marks the stage boundary.
export const pairRddAggregation: Scene = {
  id: 'pair-rdd-aggregation',
  title: 'Pair RDDs and aggregation',
  flow: 'TB',
  nodes: [
    {
      id: 'pair-code',
      kind: 'code',
      filename: 'store_totals.py',
      label: `pairs = completed.map(
    lambda r: (int(r[1]), float(r[2])))

# combines inside each partition first
totals = pairs.reduceByKey(add)
sorted(totals.collect())
# [(7, 65.0), (9, 15.0), (12, 80.0)]

# ships every value across the shuffle
grouped = pairs.groupByKey().mapValues(list)
sorted(grouped.collect())
# [(7, [40.0, 25.0]), (9, [15.0]), (12, [80.0])]

pairs.reduceByKey(add, 3).getNumPartitions()  # 3`,
    },
    {
      id: 'pair-lineage',
      kind: 'code',
      filename: 'totals.toDebugString()',
      label: `(2) PythonRDD[7] at RDD at PythonRDD.scala:56
 |  MapPartitionsRDD[6] at mapPartitions
 |  ShuffledRDD[5] at partitionBy
 +-(2) PairwiseRDD[4] at reduceByKey
    |  PythonRDD[3] at reduceByKey
    |  orders.csv HadoopRDD[0] at textFile`,
    },
  ],
  edges: [{ source: 'pair-code', target: 'pair-lineage', label: 'lineage' }],
}
