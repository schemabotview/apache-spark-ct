import type { Scene } from '@graphlearning/flow'

export const theBinaryRow: Scene = {
  id: 'tun-binary-row',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'row',
      label: 'UnsafeRow — one row, one contiguous block of bytes',
      pattern: 'group',
      sub: 'no object headers, no pointers between fields, nothing for the GC to trace inside it',
      flow: 'LR',
      children: [
        { id: 'r-null', label: 'null bit set', pattern: 'network', sub: 'one bit per field' },
        { id: 'r-fixed', label: 'fixed-width region', pattern: 'service', sub: '8 bytes per field, always' },
        { id: 'r-var', label: 'variable-length tail', pattern: 'service', sub: 'strings and arrays live here' },
      ],
    },
    {
      id: 'trick',
      label: 'The 8-byte trick',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'the slot holds an offset and a length, not the string',
    },
    {
      id: 'gains',
      label: 'What the layout buys',
      pattern: 'group',
      sub: 'every one of these follows from "it is one block of bytes", not from any cleverness above it',
      cols: 3,
      children: [
        { id: 'ga-size', label: 'a fraction of the size', pattern: 'network', sub: 'no headers, no padding, no pointers' },
        { id: 'ga-gc', label: 'invisible to the GC', pattern: 'network', sub: 'one object, not one per field' },
        { id: 'ga-seek', label: 'field n without decoding', pattern: 'network', sub: 'read at a known byte offset' },
      ],
    },
  ],
  edges: [
    { source: 'row', target: 'trick' },
    { source: 'trick', target: 'gains' },
  ],
}
