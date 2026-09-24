import type { Scene } from '@graphlearning/flow'

export const whenRddsWin: Scene = {
  id: 'rdd-when-still',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'default',
      label: 'The default is: do not',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'an RDD is opaque to the optimizer — you get exactly what you wrote',
    },
    {
      id: 'lost',
      label: 'What you give up by dropping to RDDs',
      pattern: 'group',
      sub: 'the structured API knows your rows have a schema; the RDD API knows only that they are objects',
      cols: 3,
      children: [
        { id: 'ls-cat', label: 'no Catalyst', pattern: 'warn', sub: 'no pushdown, no reordering' },
        { id: 'ls-tung', label: 'no Tungsten', pattern: 'warn', sub: 'JVM objects, not binary rows' },
        { id: 'ls-aqe', label: 'no AQE', pattern: 'warn', sub: 'nothing re-plans at runtime' },
      ],
    },
    {
      id: 'still',
      label: 'The narrow set of cases that still justify them',
      pattern: 'group',
      sub: 'each one is a thing the structured API genuinely cannot express, not a preference',
      cols: 3,
      children: [
        { id: 'st-unstructured', label: 'truly unstructured input', pattern: 'service', sub: 'before any schema exists' },
        { id: 'st-control', label: 'you need the partitioner', pattern: 'service', sub: 'custom placement, by hand' },
        { id: 'st-lowlevel', label: 'per-partition control', pattern: 'service', sub: 'one connection per partition' },
      ],
    },
  ],
  edges: [
    { source: 'default', target: 'lost' },
    { source: 'lost', target: 'still', label: 'unless' },
  ],
}
