import type { Scene } from '@graphlearning/flow'

// §3 — the disk tax. The cost that Spark exists to remove, so it gets the clearest frame in the course.
export const theDiskTax: Scene = {
  id: 'origins-disk-tax',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'chain',
      label: 'MapReduce, three steps of one algorithm',
      pattern: 'group',
      sub: 'every step ends by writing its whole output to HDFS, and the next begins by reading it back — with replication',
      children: [
        { id: 'm1', label: 'step 1 · map + reduce', pattern: 'service', sub: 'compute in memory' },
        { id: 'd1', label: 'write to HDFS', pattern: 'warn', sub: 'to disk, then replicated ×3 over the network' },
        { id: 'm2', label: 'step 2 · map + reduce', pattern: 'service', sub: 'read it all back first' },
        { id: 'd2', label: 'write to HDFS', pattern: 'warn', sub: 'to disk, then replicated ×3, again' },
        { id: 'm3', label: 'step 3 · map + reduce', pattern: 'service', sub: 'read it all back again' },
      ],
      edges: [
        { source: 'm1', target: 'd1' },
        { source: 'd1', target: 'm2' },
        { source: 'm2', target: 'd2' },
        { source: 'd2', target: 'm3' },
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
