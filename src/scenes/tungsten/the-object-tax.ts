import type { Scene } from '@graphlearning/flow'

export const theObjectTax: Scene = {
  id: 'tun-object-tax',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'one',
      label: 'One short string, as a JVM object',
      pattern: 'group',
      sub: '"abc" is three bytes of information — and it is nowhere near three bytes of memory',
      cols: 4,
      children: [
        { id: 'o-hdr', label: 'object header', pattern: 'warn', sub: '~16 bytes' },
        { id: 'o-ref', label: 'a pointer to an array', pattern: 'warn', sub: '8 bytes' },
        { id: 'o-arr', label: 'the array, with ITS header', pattern: 'warn', sub: '~16 + padding' },
        { id: 'o-data', label: 'your actual data', pattern: 'service', sub: '3 bytes' },
      ],
    },
    {
      id: 'scale',
      label: 'Multiply by a billion rows',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: '~48 bytes to store 3 · each a separate heap object',
    },
    {
      id: 'gc',
      label: 'And the second cost, which is worse',
      pattern: 'group',
      sub: 'the garbage collector must walk live objects — so the cost scales with the NUMBER of them, not their size',
      cols: 2,
      children: [
        { id: 'g-count', label: 'billions of objects', pattern: 'warn', sub: 'each one the GC must trace' },
        { id: 'g-pause', label: 'pauses, not throughput', pattern: 'warn', sub: 'a third of runtime, in bad cases' },
      ],
    },
  ],
  edges: [
    { source: 'one', target: 'scale' },
    { source: 'scale', target: 'gc' },
  ],
}
