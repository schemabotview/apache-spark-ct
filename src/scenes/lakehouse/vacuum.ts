import type { Scene } from '@graphlearning/flow'

export const vacuum: Scene = {
  id: 'lake-vacuum',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'why',
      label: 'Nothing has been deleted',
      pattern: 'service',
      icon: 'archive',
      sub: 'remove takes a file out of the TABLE, not off the disk',
    },
    {
      id: 'vacuum',
      label: 'VACUUM is the only thing that actually deletes',
      pattern: 'group',
      sub: 'it removes files no live version references, older than a retention threshold — 7 days by default',
      cols: 2,
      children: [
        { id: 'v-keeps', label: 'keeps the retention window', pattern: 'service', sub: 'so recent versions still resolve' },
        { id: 'v-deletes', label: 'deletes what is older', pattern: 'warn', sub: 'and those versions stop existing' },
      ],
    },
    {
      id: 'danger',
      label: 'Which is the one irreversible operation here',
      pattern: 'group',
      sub: 'the retention default is not timidity — it is protecting a query that started before the vacuum did',
      cols: 2,
      children: [
        { id: 'd-short', label: 'shortening retention', pattern: 'warn', sub: 'can break a running long query' },
        { id: 'd-gone', label: 'and time travel ends', pattern: 'warn', sub: 'at whatever you vacuumed to' },
      ],
    },
  ],
  edges: [
    { source: 'why', target: 'vacuum' },
    { source: 'vacuum', target: 'danger' },
  ],
}
