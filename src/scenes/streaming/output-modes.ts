import type { Scene } from '@graphlearning/flow'

// §7.9 — what each output mode delivered for the windowed query, batch by batch (data batches only),
// from 4.0.1. Complete mode ignored the watermark for dropping and counted o9.
export const outputModes: Scene = {
  id: 'output-modes',
  title: 'Append, update, complete',
  flow: 'TB',
  nodes: [
    {
      id: 'modes-table',
      kind: 'table',
      label: 'Rows sent to the sink per data batch',
      sub: 'windows by start time: sales',
      headers: ['file', 'append', 'update', 'complete'],
      values: [
        ['1', '—', '09:00 80', '09:00 80'],
        ['2', '—', '09:00 105, 09:10 140', '2 windows'],
        ['3', '09:00 135', '09:00 135, 09:20 10', '3 windows'],
        ['4', '09:10 140', '09:30 20', '4 windows, 09:00 140'],
      ],
    },
    {
      id: 'modes-rules',
      kind: 'list',
      framed: true,
      label: 'Which mode for which query',
      sub: '4.0.1 compatibility matrix',
      icon: 'tree',
      pattern: 'service',
      items: [
        'append: rows that will never change',
        'update: changed rows only',
        'complete: whole result, aggregations only',
        'complete keeps all state: no watermark drop',
      ],
    },
  ],
  edges: [],
}
