import type { Scene } from '@graphlearning/flow'

// §4 — sort-merge join. Drawn as the three phases it actually has, because "it shuffles" is the
// half of the story everyone tells and "then it sorts" is the half that explains the cost.
export const sortMerge: Scene = {
  id: 'joins-sort-merge',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'smj',
      label: 'Sort-merge join — the default when neither side is small',
      pattern: 'group',
      sub: 'three phases, two of them expensive, and it is the only strategy that never needs a side to fit in memory',
      children: [
        {
          id: 'phase-1',
          label: '1 · Shuffle both sides',
          pattern: 'warn',
          sub: 'hash(join key) → the same partition id on both sides',
          flow: 'LR',
          children: [
            { id: 's-left', label: 'orders', pattern: 'storage', sub: 'repartitioned by customer_id' },
            { id: 's-right', label: 'customers', pattern: 'storage', sub: 'repartitioned by customer_id' },
          ],
        },
        { id: 'phase-2', label: '2 · Sort each partition', pattern: 'service', sub: 'by the join key, on both sides — spills if it does not fit' },
        { id: 'phase-3', label: '3 · Merge in one pass', pattern: 'service', sub: 'two cursors walk the sorted runs together, in lockstep' },
      ],
      edges: [
        { source: 'phase-1', target: 'phase-2' },
        { source: 'phase-2', target: 'phase-3' },
      ],
    },
    {
      id: 'why',
      label: 'Why sort, when hashing found the partition already',
      pattern: 'group',
      sub: 'the sort is what lets the merge stream — and streaming is what removes the memory ceiling',
      cols: 2,
      children: [
        { id: 'w-stream', label: 'nothing is held whole', pattern: 'service', sub: 'neither side must fit in memory' },
        { id: 'w-spill', label: 'it degrades, not dies', pattern: 'service', sub: 'too big → spill and carry on' },
      ],
    },
  ],
  edges: [{ source: 'smj', target: 'why' }],
}
