import type { Scene } from '@graphlearning/flow'

// §7.4 — the four trigger types from the 4.0.1 guide, with the constraint that matters for each.
export const triggerModes: Scene = {
  id: 'trigger-modes',
  title: 'Triggers and cadence',
  flow: 'TB',
  nodes: [
    {
      id: 'trigger-code',
      kind: 'code',
      filename: 'triggers.py',
      label: `w = df.writeStream.option("checkpointLocation", ck)
# default: next batch as soon as the last ends
w.start()
w.trigger(processingTime="2 seconds").start()
w.trigger(availableNow=True).start()
# experimental, map-like queries only
w.trigger(continuous="1 second").start()`,
    },
    {
      id: 'trigger-table',
      kind: 'table',
      label: 'Execution modes',
      sub: 'Spark 4.0.1',
      headers: ['trigger', 'when batches run', 'constraint'],
      values: [
        ['default', 'as soon as the last ends', 'micro-batch latency'],
        ['processingTime', 'on a fixed interval', 'late batch starts at once'],
        ['availableNow', 'all data now, then stop', 'needs a supporting source'],
        ['continuous', 'long-running tasks', 'map-like queries only'],
      ],
    },
  ],
  edges: [{ source: 'trigger-code', target: 'trigger-table' }],
}
