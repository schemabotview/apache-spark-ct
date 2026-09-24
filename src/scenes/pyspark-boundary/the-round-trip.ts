import type { Scene } from '@graphlearning/flow'

export const theRoundTrip: Scene = {
  id: 'pyb-round-trip',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'loop',
      label: 'What happens to one row',
      pattern: 'group',
      sub: 'and then again for the next row, and the next — a million times per partition',
      cols: 1,
      children: [
        { id: 'l-1', label: '1 · read in the JVM', pattern: 'network', sub: 'an UnsafeRow, compact bytes' },
        { id: 'l-2', label: '2 · serialise', pattern: 'warn', sub: 'pickle it into Python’s format' },
        { id: 'l-3', label: '3 · write to a socket', pattern: 'warn', sub: 'a real OS pipe, with syscalls' },
        { id: 'l-4', label: '4 · deserialise', pattern: 'warn', sub: 'build a Python object' },
        { id: 'l-5', label: '5 · your function', pattern: 'service', sub: 'the only step you wanted' },
        { id: 'l-6', label: '6 · all of it, backwards', pattern: 'warn', sub: 'pickle, socket, unpickle' },
      ],
      edges: [
        { source: 'l-1', target: 'l-2' },
        { source: 'l-2', target: 'l-3' },
        { source: 'l-3', target: 'l-4' },
        { source: 'l-4', target: 'l-5' },
        { source: 'l-5', target: 'l-6' },
      ],
    },
    {
      id: 'ratio',
      label: 'The ratio to remember',
      pattern: 'warn',
      icon: 'scale',
      sub: 'five steps of transport around one step of work',
    },
  ],
  edges: [{ source: 'loop', target: 'ratio' }],
}
