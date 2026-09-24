import type { Scene } from '@graphlearning/flow'

// §1 why-a-shuffle — the whole course rests on one distinction, so it gets the whole first frame.
// Two groups side by side, each drawn with its own internal edges so the ARROWS carry the argument
// and the labels only name it: narrow is two parallel 1:1 lines, wide is a four-edge crossing. The
// crossing is the point — you cannot draw a wide dependency without lines that cross, and that
// crossing is the network. `warn` on the wide group's output pair marks where the cost lands.
export const dependencies: Scene = {
  id: 'shuffle-dependencies',
  padding: 0.14,
  flow: 'LR',
  nodes: [
    {
      id: 'narrow',
      label: 'Narrow dependency',
      pattern: 'group',
      sub: 'filter · map · union — every output reads exactly one input',
      cols: 2,
      children: [
        { id: 'n-in-0', label: 'partition 0', pattern: 'storage', sub: 'rows on host A' },
        { id: 'n-out-0', label: 'partition 0′', pattern: 'service', sub: 'same host, no network' },
        { id: 'n-in-1', label: 'partition 1', pattern: 'storage', sub: 'rows on host B' },
        { id: 'n-out-1', label: 'partition 1′', pattern: 'service', sub: 'same host, no network' },
      ],
      edges: [
        { source: 'n-in-0', target: 'n-out-0' },
        { source: 'n-in-1', target: 'n-out-1' },
      ],
    },
    {
      id: 'wide',
      label: 'Wide dependency',
      pattern: 'group',
      sub: 'groupBy · join · distinct — an output needs rows it does not hold',
      cols: 2,
      children: [
        { id: 'w-in-0', label: 'partition 0', pattern: 'storage', sub: 'keys a, b' },
        { id: 'w-out-0', label: 'partition 0′', pattern: 'warn', sub: 'all of key a' },
        { id: 'w-in-1', label: 'partition 1', pattern: 'storage', sub: 'keys a, b' },
        { id: 'w-out-1', label: 'partition 1′', pattern: 'warn', sub: 'all of key b' },
      ],
      edges: [
        { source: 'w-in-0', target: 'w-out-0' },
        { source: 'w-in-0', target: 'w-out-1' },
        { source: 'w-in-1', target: 'w-out-0' },
        { source: 'w-in-1', target: 'w-out-1' },
      ],
    },
  ],
  edges: [],
}
