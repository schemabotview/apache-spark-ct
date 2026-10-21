import type { Scene, SceneNode } from '@graphlearning/flow'
import incremental from '../../../spine/stream/01-incremental/project/stream/incremental.py?raw'
import liveSales from '../../../spine/stream/13-live-sales/project/jobs/live_sales.py?raw'

// What a source and a sink each promise, from the Structured Streaming guide for Spark 4.0.1 (the
// "Input Sources" and "Output Sinks" tables): no step runs here, so every cell is the guide's, not a
// measurement. The two code cards quote the source this course reads and the sink its job writes.
const card = (id: string, filename: string, label: string, show: [number, number][]): SceneNode =>
  ({ id, kind: 'code', filename, label: label.replace(/\n+$/, ''), show, hug: true, pattern: 'storage' })

export const sourcesSinks: Scene = {
  id: 'sources-sinks',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'ours',
      label: 'This course reads files, and its job writes Parquet',
      bare: true,
      children: [
        card('our-source', 'stream/incremental.py — the source', incremental, [[12, 14]]),
        card('our-sink', 'jobs/live_sales.py — the sink', liveSales, [[26, 29]]),
        {
          id: 'replay-rule',
          kind: 'list',
          icon: 'repeat',
          label: 'End-to-end exactly once needs both ends',
          pattern: 'service',
          items: [
            'A source that can REPLAY: read the same offsets again',
            'A checkpoint that records which offsets each batch took',
            'A sink that is IDEMPOTENT: writing a batch twice changes nothing',
            'Lose any one and a crash means lost or doubled rows',
          ],
        },
      ],
    },
    {
      id: 'promises',
      label: 'What each end promises (Spark 4.0.1 guide)',
      bare: true,
      framed: true,
      children: [
        {
          id: 'sources',
          kind: 'table',
          label: 'Sources: can it replay?',
          headers: ['source', 'replay', 'position kept as'],
          values: [
            ['File', 'yes', 'files already read'],
            ['Kafka', 'yes', 'topic offsets'],
            ['Rate', 'yes', 'rows generated'],
            ['Socket', 'no', 'testing only'],
          ],
        },
        {
          id: 'sinks',
          kind: 'table',
          label: 'Sinks: what does a replay do?',
          headers: ['sink', 'fault tolerance'],
          values: [
            ['File (Parquet, JSON…)', 'exactly once'],
            ['Kafka', 'at least once'],
            ['foreachBatch', 'up to your code'],
            ['foreach', 'at least once'],
            ['Console, Memory', 'none: debugging'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
