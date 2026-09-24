import type { Scene } from '@graphlearning/flow'

// §2 — broadcast hash join. The point is the asymmetry: one side travels, the other never moves.
export const broadcastJoin: Scene = {
  id: 'joins-broadcast',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'driver',
      label: 'Driver',
      pattern: 'service',
      icon: 'server',
      sub: 'collects the small side, then broadcasts it',
    },
    {
      id: 'cluster',
      label: 'Every executor gets the whole small table',
      pattern: 'group',
      sub: 'the big side never moves — no shuffle, no stage boundary, no Exchange in the plan',
      cols: 3,
      children: [
        {
          id: 'e1',
          label: 'Executor A',
          pattern: 'network',
          cols: 1,
          children: [
            { id: 'e1-hash', label: 'hash table', pattern: 'service', sub: 'the whole small side' },
            { id: 'e1-part', label: 'its big partition', pattern: 'storage', sub: 'stays exactly where it was' },
          ],
        },
        {
          id: 'e2',
          label: 'Executor B',
          pattern: 'network',
          cols: 1,
          children: [
            { id: 'e2-hash', label: 'hash table', pattern: 'service', sub: 'an identical copy' },
            { id: 'e2-part', label: 'its big partition', pattern: 'storage', sub: 'stays exactly where it was' },
          ],
        },
        {
          id: 'e3',
          label: 'Executor C',
          pattern: 'network',
          cols: 1,
          children: [
            { id: 'e3-hash', label: 'hash table', pattern: 'service', sub: 'an identical copy' },
            { id: 'e3-part', label: 'its big partition', pattern: 'storage', sub: 'stays exactly where it was' },
          ],
        },
      ],
    },
    {
      id: 'probe',
      label: 'Then every task probes locally — one pass, no network',
      pattern: 'group',
      sub: 'the big partition is streamed through, and each row looks its key up in the table already beside it',
      cols: 2,
      children: [
        { id: 'p-stream', label: 'stream the partition', pattern: 'service', sub: 'read once, in place' },
        { id: 'p-lookup', label: 'one local lookup', pattern: 'service', sub: 'per row, against the local hash table' },
      ],
    },
  ],
  edges: [
    { source: 'driver', target: 'cluster', label: 'one copy per executor' },
    { source: 'cluster', target: 'probe' },
  ],
}
