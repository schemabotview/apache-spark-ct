import type { Scene } from '@graphlearning/flow'

export const sparkSession: Scene = {
  id: 'topology-sparksession',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'before',
      label: 'Before Spark 2.0 — one context per library',
      pattern: 'group',
      sub: 'they had to be created in the right order, and passed around by hand',
      cols: 4,
      children: [
        { id: 'b-sc', label: 'SparkContext', pattern: 'warn', sub: 'RDDs, the cluster' },
        { id: 'b-sql', label: 'SQLContext', pattern: 'warn', sub: 'DataFrames' },
        { id: 'b-hive', label: 'HiveContext', pattern: 'warn', sub: 'the metastore' },
        { id: 'b-stream', label: 'StreamingContext', pattern: 'warn', sub: 'DStreams' },
      ],
    },
    {
      id: 'now',
      label: 'SparkSession',
      pattern: 'service',
      icon: 'key',
      sub: 'one entry point · pre-made as `spark` in every shell and notebook',
    },
    {
      id: 'holds',
      label: 'What it actually holds',
      pattern: 'group',
      sub: 'a session is not a connection — it is the configuration and catalog your plans are built against',
      cols: 3,
      children: [
        { id: 'h-conf', label: 'the configuration', pattern: 'network', sub: 'every spark.* setting' },
        { id: 'h-cat', label: 'the catalog', pattern: 'network', sub: 'databases, tables, views' },
        { id: 'h-sc', label: 'the SparkContext', pattern: 'network', sub: 'still there, underneath' },
      ],
    },
  ],
  edges: [
    { source: 'before', target: 'now', label: 'collapsed in 2.0' },
    { source: 'now', target: 'holds' },
  ],
}
