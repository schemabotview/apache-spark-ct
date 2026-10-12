import type { Scene } from '@graphlearning/flow'

// §8.6 — the diagnostic path for a late daily run: alert → history server → slowest stage → its
// tasks → executor logs, each reached through a documented 4.0.1 interface.
export const observabilityPath: Scene = {
  id: 'observability-path',
  title: 'From alert to cause',
  flow: 'TB',
  nodes: [
    {
      id: 'eventlog-conf',
      kind: 'code',
      filename: 'spark-defaults.conf',
      label: `spark.eventLog.enabled          true
spark.eventLog.dir              hdfs:///spark-logs
spark.history.fs.logDirectory   hdfs:///spark-logs
# history server UI on :18080, REST at /api/v1`,
    },
    {
      id: 'diagnose-steps',
      label: 'The 06:00 run finished at 07:10',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'step-alert', label: '1  Alert', sub: 'runtime > 45 min', icon: 'bell' },
        { id: 'step-history', label: '2  History server', sub: 'job 3: 58 of 70 min', icon: 'history' },
        { id: 'step-stage', label: '3  Slowest stage', sub: 'max task 41 min, median 20 s', icon: 'barchart' },
        { id: 'step-logs', label: '4  Executor logs', sub: 'one key: store 7', icon: 'scroll' },
      ],
    },
  ],
  edges: [{ source: 'eventlog-conf', target: 'diagnose-steps' }],
}
