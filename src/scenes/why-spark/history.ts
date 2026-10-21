import type { Scene, SceneNode } from '@graphlearning/flow'

// Dates are from the MapReduce paper (OSDI 2004), the RDD paper (NSDI 2012) and the Apache Spark
// release notes and news archive (spark.apache.org/news) — not measured here.
const when = (id: string, label: string, sub: string): SceneNode => ({ id, label, sub, icon: 'calendar' })
const era = (id: string, badge: string, label: string, sub: string, pattern: SceneNode['pattern'], children: SceneNode[]): SceneNode =>
  ({ id, badge, label, sub, pattern, icon: 'none', cols: 3, align: 'start', children: children.map((c) => ({ ...c, pattern })) })
const step = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })

export const history: Scene = {
  id: 'mapreduce-to-spark',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'contrast',
      label: 'Contrast',
      bare: true,
      children: [
        {
          id: 'pair',
          label: 'The same pipeline, twice',
          bare: true,
          cols: 2,
          align: 'start',
          stretch: true,
          children: [
        {
          id: 'mapreduce',
          label: 'MapReduce',
          sub: 'every step is a job; every job ends on disk',
          pattern: 'warn',
          icon: 'hadoop',
          children: [
            step('mr-1', 'map → reduce', 'job 1', 'gears', 'warn'),
            step('mr-d1', 'HDFS', 'written, replicated', 'harddrive', 'warn'),
            step('mr-2', 'map → reduce', 'job 2', 'gears', 'warn'),
            step('mr-d2', 'HDFS', 'read back, written again', 'harddrive', 'warn'),
          ],
          edges: [
            { source: 'mr-1', target: 'mr-d1' },
            { source: 'mr-d1', target: 'mr-2' },
            { source: 'mr-2', target: 'mr-d2' },
          ],
        },
        {
          id: 'spark',
          label: 'Spark',
          sub: 'one plan; data stays in memory between steps',
          pattern: 'service',
          icon: 'spark',
          children: [
            step('sp-1', 'read', 'partitions', 'file', 'service'),
            step('sp-2', 'filter, join', 'in memory', 'memory', 'service'),
            step('sp-3', 'aggregate', 'one shuffle', 'sigma', 'service'),
            step('sp-4', 'write', 'once, at the end', 'harddrive', 'service'),
          ],
          edges: [
            { source: 'sp-1', target: 'sp-2' },
            { source: 'sp-2', target: 'sp-3' },
            { source: 'sp-3', target: 'sp-4' },
          ],
        },
          ],
        },
        {
          id: 'changed',
          kind: 'table',
          label: 'What changed',
          headers: ['', 'MapReduce', 'Spark'],
          values: [
            ['a pipeline', 'one job per step', 'one plan, optimised first'],
            ['between steps', 'written to HDFS', 'kept in memory'],
            ['a lost machine', 'replicas on disk', 'recomputed from lineage'],
            ['workloads', 'batch', 'SQL, batch, streaming, ML'],
          ],
        },
      ],
    },
    {
      id: 'eras',
      label: 'Timeline',
      bare: true,
      children: [
        era('before', '1', 'MapReduce', '2004 – 2009', 'warn', [
          when('paper', 'December 2004', 'Google’s MapReduce paper: map, shuffle, reduce, on cheap machines'),
          when('hadoop', 'January 2006', 'Hadoop, an open-source MapReduce and HDFS, becomes its own project'),
          when('amplab', '2009', 'Spark begins at UC Berkeley, for jobs that loop over the same data'),
        ]),
        era('rise', '2', 'Apache Spark', '2010 – 2016', 'storage', [
          when('open', '2010', 'Spark is open-sourced'),
          when('rdd', 'April 2012', 'The RDD paper: resilient distributed datasets and lineage'),
          when('apache', 'February 2014', 'A top-level Apache project; Spark 1.0 follows in May'),
          when('v2', 'July 2016', 'Spark 2.0: SparkSession, DataFrames as the main API, Structured Streaming'),
        ]),
        era('now', '3', 'Today', '2020 – 2025', 'network', [
          when('v3', 'June 2020', 'Spark 3.0: Adaptive Query Execution re-plans a query while it runs'),
          when('v4', 'May 2025', 'Spark 4.0: ANSI SQL mode on by default, Spark Connect, VARIANT'),
          when('baseline', 'September 2025', 'Spark 4.0.1 — the version this course runs on'),
        ]),
      ],
    },
  ],
  edges: [],
}
