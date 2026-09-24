import type { Scene } from '@graphlearning/flow'

// §9 — bucketing. The idea is a shuffle moved in TIME, so the frame is two timelines: what happens
// every day without it, and what happens once with it.
export const bucketing: Scene = {
  id: 'joins-bucketing',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'without',
      label: 'Without bucketing — every run pays again',
      pattern: 'group',
      sub: 'the same table, shuffled by the same key, every single day',
      flow: 'LR',
      children: [
        { id: 'd1', label: 'Monday', pattern: 'warn', sub: 'shuffle both sides' },
        { id: 'd2', label: 'Tuesday', pattern: 'warn', sub: 'shuffle both sides' },
        { id: 'd3', label: 'Wednesday', pattern: 'warn', sub: 'shuffle both sides' },
      ],
    },
    {
      id: 'with',
      label: 'With bucketing — pay once, at write time',
      pattern: 'group',
      sub: 'bucketBy(320, "customer_id").sortBy("customer_id").saveAsTable(…)',
      flow: 'LR',
      children: [
        { id: 'w0', label: 'write day', pattern: 'service', sub: 'the shuffle happens here, once' },
        { id: 'w1', label: 'Monday', pattern: 'network', sub: 'no Exchange in the plan' },
        { id: 'w2', label: 'every day after', pattern: 'network', sub: 'no Exchange in the plan' },
      ],
    },
    {
      id: 'conditions',
      label: 'The conditions, all of which must hold',
      pattern: 'group',
      sub: 'miss one and you get no error, no warning, and no benefit — just the shuffle you thought you had removed',
      cols: 3,
      children: [
        { id: 'c-col', label: 'same column', pattern: 'warn', sub: 'on both tables' },
        { id: 'c-count', label: 'same bucket count', pattern: 'warn', sub: 'or a multiple, on Spark 3.1+' },
        { id: 'c-table', label: 'a managed table', pattern: 'warn', sub: 'saveAsTable, not a bare path' },
      ],
    },
  ],
  edges: [
    { source: 'without', target: 'with', label: 'move the cost in time' },
    { source: 'with', target: 'conditions' },
  ],
}
