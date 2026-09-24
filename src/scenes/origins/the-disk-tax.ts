import type { Scene } from '@graphlearning/flow'

// §3 — the disk tax. The cost that Spark exists to remove, so it gets the clearest frame in the course.
export const theDiskTax: Scene = {
  id: 'origins-disk-tax',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'chain',
      label: 'One boundary, between two steps of one algorithm',
      pattern: 'group',
      sub: 'and a three-step job pays this twice · a hundred-step job pays it ninety-nine times',
      children: [
        { id: 'm1', label: 'step 1 · map + reduce', pattern: 'service', sub: 'computes in memory — fast' },
        { id: 'd1', label: 'write to HDFS', pattern: 'warn', sub: 'to disk, then replicated ×3 over the network' },
        { id: 'm2', label: 'step 2 · map + reduce', pattern: 'service', sub: 'and it starts by reading all of that back' },
      ],
      edges: [
        { source: 'm1', target: 'd1' },
        { source: 'd1', target: 'm2' },
      ],
    },
    {
      id: 'who-pays',
      label: 'Who this hurts most',
      pattern: 'group',
      sub: 'any algorithm whose steps are a loop rather than a line — which is most of the interesting ones',
      cols: 3,
      children: [
        { id: 'w-ml', label: 'machine learning', pattern: 'warn', sub: 'the same data, 100 iterations' },
        { id: 'w-graph', label: 'graph algorithms', pattern: 'warn', sub: 'PageRank, until it converges' },
        { id: 'w-interactive', label: 'interactive queries', pattern: 'warn', sub: 'a re-read for every question' },
      ],
    },
  ],
  edges: [{ source: 'chain', target: 'who-pays', label: 'the round-trip is per step' }],
}
