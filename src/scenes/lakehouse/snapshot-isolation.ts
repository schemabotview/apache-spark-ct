import type { Scene } from '@graphlearning/flow'

export const snapshotIsolation: Scene = {
  id: 'lake-snapshot',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'read',
      label: 'A reader resolves the version once, at the start',
      pattern: 'group',
      sub: 'read the log to version N, take the set of files it describes, and use that set for the whole query',
      cols: 2,
      children: [
        { id: 'r-pin', label: 'pins version 7', pattern: 'service', sub: 'a fixed set of files' },
        { id: 'r-scan', label: 'and reads only those', pattern: 'service', sub: 'for the entire query' },
      ],
    },
    {
      id: 'meanwhile',
      label: 'A writer commits v8',
      pattern: 'network',
      icon: 'edit',
      sub: 'and the running reader never sees any of it',
    },
    {
      id: 'why',
      label: 'Which is what actually makes the table usable',
      pattern: 'group',
      sub: 'writers stop needing a window when nobody is reading — the thing every nightly pipeline is scheduled around',
      cols: 2,
      children: [
        { id: 'w-consistent', label: 'a consistent answer', pattern: 'service', sub: 'never half of two versions' },
        { id: 'w-nolock', label: 'and no locking', pattern: 'service', sub: 'readers never block a writer' },
      ],
    },
  ],
  edges: [
    { source: 'read', target: 'meanwhile' },
    { source: 'meanwhile', target: 'why' },
  ],
}
