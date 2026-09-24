import type { Scene } from '@graphlearning/flow'

export const virtualCallProblem: Scene = {
  id: 'tun-virtual-calls',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'volcano',
      label: 'The classic model: every operator is an iterator',
      pattern: 'group',
      sub: 'each one calls next() on its child — the textbook design, and it is correct and general',
      flow: 'LR',
      children: [
        { id: 'v-proj', label: 'Project.next()', pattern: 'network', sub: 'calls its child' },
        { id: 'v-filt', label: 'Filter.next()', pattern: 'network', sub: 'calls its child' },
        { id: 'v-scan', label: 'Scan.next()', pattern: 'storage', sub: 'returns a row' },
      ],
      edges: [
        { source: 'v-proj', target: 'v-filt' },
        { source: 'v-filt', target: 'v-scan' },
      ],
    },
    {
      id: 'cost',
      label: 'What it costs per row',
      pattern: 'group',
      sub: 'per row, per operator — and the work inside each call is often a single comparison',
      cols: 3,
      children: [
        { id: 'c-virt', label: 'a virtual call', pattern: 'warn', sub: 'not inlinable, not predictable' },
        { id: 'c-row', label: 'an intermediate row', pattern: 'warn', sub: 'materialised between each pair' },
        { id: 'c-ratio', label: 'overhead > work', pattern: 'warn', sub: 'the call costs more than the compare' },
      ],
    },
  ],
  edges: [{ source: 'volcano', target: 'cost' }],
}
