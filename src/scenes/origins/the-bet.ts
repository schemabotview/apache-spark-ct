import type { Scene } from '@graphlearning/flow'

// §5 — the bet. Two things kept, one thing changed. That framing is the section.
export const theBet: Scene = {
  id: 'origins-the-bet',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'keep',
      label: 'Keep what MapReduce got right',
      pattern: 'group',
      sub: 'UC Berkeley AMPLab, 2009 — the distribution model was never the problem',
      cols: 2,
      children: [
        { id: 'k-par', label: 'data parallelism', pattern: 'service', sub: 'partition it, run the same code on each' },
        { id: 'k-ft', label: 'fault tolerance', pattern: 'service', sub: 'a node dies, the work is redone' },
      ],
    },
    {
      id: 'change',
      label: 'Change one thing',
      pattern: 'warn',
      icon: 'zap',
      sub: 'keep intermediate results in memory between steps',
    },
    {
      id: 'follows',
      label: 'What falls out of that single change',
      pattern: 'group',
      sub: 'not a faster MapReduce — a different set of things it is possible to write at all',
      cols: 3,
      children: [
        { id: 'f-iter', label: 'iteration is cheap', pattern: 'network', sub: 'loop over cached data, not disk' },
        { id: 'f-interactive', label: 'queries feel live', pattern: 'network', sub: 'seconds, not minutes' },
        { id: 'f-lineage', label: 'and still fault-tolerant', pattern: 'network', sub: 'lineage replaces replication' },
      ],
    },
  ],
  edges: [
    { source: 'keep', target: 'change' },
    { source: 'change', target: 'follows' },
  ],
}
