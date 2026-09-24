import type { Scene } from '@graphlearning/flow'

export const theTrigger: Scene = {
  id: 'str-trigger',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'The trigger decides WHEN a batch runs — and nothing else changes',
      sub: 'the same query, the same output; only the rhythm of execution differs',
      headers: ['Trigger', 'What it does', 'Use when'],
      values: [
        ['default', 'a new micro-batch as soon as the last finishes', 'lowest latency, and you accept variable batch sizes'],
        ['processingTime("1 minute")', 'one batch a minute, on the clock', 'a predictable rhythm; skips if a batch overruns'],
        ['availableNow', 'process everything waiting, then stop', 'a scheduled job that catches up and exits'],
        ['continuous (experimental)', 'record at a time, ~1 ms latency', 'rarely — it supports only map-like operations'],
      ],
    },
    {
      id: 'note',
      label: 'availableNow: the missed one',
      pattern: 'network',
      icon: 'lightbulb',
      sub: 'a batch job that remembers where it stopped',
    },
  ],
  edges: [{ source: 'table', target: 'note' }],
}
