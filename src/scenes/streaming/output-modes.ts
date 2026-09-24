import type { Scene } from '@graphlearning/flow'

export const outputModes: Scene = {
  id: 'str-output-modes',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'Output modes — what gets written out of the result table',
      sub: 'not a preference: each one is legal only for certain queries, and the errors say so at start-up',
      headers: ['Mode', 'Writes', 'Constraint'],
      values: [
        ['append', 'only rows that will never change again', 'aggregations need a watermark, so Spark knows when that is'],
        ['update', 'rows that changed in this batch', 'the sink must handle an upsert, not just an insert'],
        ['complete', 'the whole result table, every batch', 'aggregations only — and the state can never be dropped'],
      ],
    },
    {
      id: 'trap',
      label: 'complete ends in tears',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'every key ever seen, held forever, rewritten each batch',
    },
  ],
  edges: [{ source: 'table', target: 'trap' }],
}
