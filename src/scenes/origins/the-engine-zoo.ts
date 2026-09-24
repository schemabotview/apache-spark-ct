import type { Scene } from '@graphlearning/flow'

// §4 — the zoo. Drawn as a ring of specialists around one storage layer, because "they all had to be
// learned, operated and kept in sync" is the cost, and that only reads as a diagram.
export const theEngineZoo: Scene = {
  id: 'origins-engine-zoo',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'zoo',
      label: 'One specialist engine per workload, each with its own everything',
      pattern: 'group',
      sub: 'a separate API, a separate cluster to operate, a separate failure model, and a separate set of people who know it',
      cols: 3,
      children: [
        { id: 'z-hive', label: 'Hive', pattern: 'network', sub: 'SQL over MapReduce' },
        { id: 'z-storm', label: 'Storm', pattern: 'network', sub: 'stream processing' },
        { id: 'z-impala', label: 'Impala', pattern: 'network', sub: 'interactive SQL' },
        { id: 'z-giraph', label: 'Giraph', pattern: 'network', sub: 'graph processing' },
        { id: 'z-mahout', label: 'Mahout', pattern: 'network', sub: 'machine learning' },
        { id: 'z-drill', label: 'Drill', pattern: 'network', sub: 'ad-hoc queries' },
      ],
    },
    {
      id: 'glue',
      label: 'And the real work was between them',
      pattern: 'group',
      sub: 'a pipeline crossing three engines wrote to disk at every border, because nothing else could be shared',
      cols: 2,
      children: [
        { id: 'g-copy', label: 'data copied between', pattern: 'warn', sub: 'formats converted at every hop' },
        { id: 'g-ops', label: 'four clusters to run', pattern: 'warn', sub: 'and four things to be paged about' },
      ],
    },
  ],
  edges: [{ source: 'zoo', target: 'glue' }],
}
