import type { Scene } from '@graphlearning/flow'

// §2.3 — where the client boundary sits. Classic: the Python process drives the driver JVM through
// Py4J. Connect: a thin client sends unresolved logical plans (protobuf over gRPC) and receives Arrow
// row batches. The code card shows the two calls that fail on a Connect session in 4.0.1.
export const classicVsConnect: Scene = {
  id: 'classic-vs-connect',
  title: 'Classic Spark versus Spark Connect',
  flow: 'TB',
  nodes: [
    {
      id: 'two-modes',
      label: 'Where the client ends',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'classic-mode',
          label: 'Classic',
          pattern: 'service',
          flow: 'TB',
          children: [
            { id: 'classic-python', label: 'Python process', sub: 'your code and PySpark', icon: 'code' },
            { id: 'classic-driver', label: 'Driver JVM', sub: 'started alongside it', icon: 'server' },
          ],
          edges: [{ source: 'classic-python', target: 'classic-driver', label: 'Py4J', bidirectional: true }],
        },
        {
          id: 'connect-mode',
          label: 'Spark Connect',
          pattern: 'network',
          flow: 'TB',
          children: [
            { id: 'connect-client', label: 'Thin client', sub: 'builds unresolved plans', icon: 'monitor' },
            { id: 'connect-server', label: 'Connect server', sub: 'in a remote driver', icon: 'server' },
          ],
          edges: [{ source: 'connect-client', target: 'connect-server', label: 'gRPC', bidirectional: true }],
        },
      ],
    },
    {
      id: 'connect-code',
      kind: 'code',
      filename: 'connect_session.py',
      label: `spark = (SparkSession.builder
         .remote("sc://localhost:15002")
         .getOrCreate())

orders = spark.read.parquet("orders/")   # a plan only
orders.count()        # plan over gRPC, result as Arrow
spark.sparkContext    # JVM_ATTRIBUTE_NOT_SUPPORTED
orders.rdd            # NOT_IMPLEMENTED`,
    },
  ],
  edges: [],
}
