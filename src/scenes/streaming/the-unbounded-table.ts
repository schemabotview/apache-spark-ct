import type { Scene } from '@graphlearning/flow'

export const theUnboundedTable: Scene = {
  id: 'str-unbounded-table',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      label: 'A stream is a table that rows keep being appended to',
      pattern: 'group',
      sub: 'not a sequence of events to react to — a table, which happens never to be finished',
      flow: 'LR',
      children: [
        { id: 't-1', label: 'rows so far', pattern: 'service', sub: 'processed' },
        { id: 't-2', label: 'new rows', pattern: 'network', sub: 'arriving now' },
        { id: 't-3', label: '…', pattern: 'warn', sub: 'and it never ends' },
      ],
    },
    {
      id: 'query',
      label: 'Query it as a table',
      pattern: 'service',
      icon: 'filecode',
      sub: 'the same groupBy you would write over a finished table, unchanged',
    },
    {
      id: 'result',
      label: 'The result table, kept up to date',
      pattern: 'group',
      sub: 'conceptually recomputed from the whole input every time — and then made efficient, which is §4',
      cols: 2,
      children: [
        { id: 'r-think', label: 'think: recomputed', pattern: 'network', sub: 'the model you reason with' },
        { id: 'r-run', label: 'run: incrementally', pattern: 'service', sub: 'what actually happens' },
      ],
    },
  ],
  edges: [
    { source: 'table', target: 'query' },
    { source: 'query', target: 'result' },
  ],
}
