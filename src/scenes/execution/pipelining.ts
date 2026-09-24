import type { Scene } from '@graphlearning/flow'

export const pipelining: Scene = {
  id: 'exec-pipelining',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'imagined',
      label: 'What people imagine three narrow steps cost',
      pattern: 'group',
      sub: 'three passes over the data, and two intermediate collections nobody asked for',
      flow: 'LR',
      children: [
        { id: 'i1', label: 'pass 1 · filter', pattern: 'warn', sub: 'write result' },
        { id: 'i2', label: 'pass 2 · map', pattern: 'warn', sub: 'write result' },
        { id: 'i3', label: 'pass 3 · filter', pattern: 'warn', sub: 'write result' },
      ],
      edges: [
        { source: 'i1', target: 'i2' },
        { source: 'i2', target: 'i3' },
      ],
    },
    {
      id: 'actual',
      label: 'What it actually costs',
      pattern: 'service',
      icon: 'zap',
      sub: 'one row in → all three applied → next row',
    },
    {
      id: 'stops',
      label: 'Where the fusion stops',
      pattern: 'group',
      sub: 'exactly one thing ends it, and it is the same thing that ends a stage',
      cols: 2,
      children: [
        { id: 's-shuffle', label: 'a wide dependency', pattern: 'warn', sub: 'the boundary, every time' },
        { id: 's-opaque', label: 'an opaque function', pattern: 'warn', sub: 'a UDF Spark cannot see into' },
      ],
    },
  ],
  edges: [
    { source: 'imagined', target: 'actual', label: 'it does not work like this' },
    { source: 'actual', target: 'stops' },
  ],
}
