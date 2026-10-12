import type { Scene } from '@graphlearning/flow'

// §7.3 — the built-in sources and sinks with the fault-tolerance column of the 4.0.1 Structured
// Streaming guide.
export const sourcesSinks: Scene = {
  id: 'sources-sinks',
  title: 'Sources, sinks and their contracts',
  flow: 'TB',
  nodes: [
    {
      id: 'source-table',
      kind: 'table',
      label: 'Sources',
      sub: 'can it replay from an offset?',
      headers: ['source', 'offset', 'fault-tolerant'],
      values: [
        ['file', 'file log index', 'yes'],
        ['Kafka', 'partition offsets', 'yes'],
        ['rate (testing)', 'generated count', 'yes'],
        ['socket (testing)', '—', 'no'],
      ],
    },
    {
      id: 'sink-table',
      kind: 'table',
      label: 'Sinks',
      sub: 'what a retry can do to the output',
      headers: ['sink', 'output modes', 'guarantee'],
      values: [
        ['file', 'append', 'exactly-once'],
        ['Kafka', 'all', 'at-least-once'],
        ['foreach', 'all', 'at-least-once'],
        ['foreachBatch', 'all', 'depends on your code'],
        ['console, memory', 'debugging', 'none'],
      ],
    },
  ],
  edges: [],
}
