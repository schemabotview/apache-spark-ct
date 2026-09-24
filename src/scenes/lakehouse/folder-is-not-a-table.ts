import type { Scene } from '@graphlearning/flow'

export const folderIsNotATable: Scene = {
  id: 'lake-folder-not-table',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'have',
      label: 'What you have: a directory of Parquet files',
      pattern: 'group',
      sub: 'excellent at being read — and that is the whole of what it is good at',
      cols: 2,
      children: [
        { id: 'h-fast', label: 'fast to scan', pattern: 'service', sub: 'columnar, pruned, compressed' },
        { id: 'h-open', label: 'readable by anything', pattern: 'service', sub: 'no vendor in the way' },
      ],
    },
    {
      id: 'missing',
      label: 'What a table has that this does not',
      pattern: 'group',
      sub: 'every one of these is something a database gave you for free, and you have quietly stopped having',
      cols: 4,
      children: [
        { id: 'm-atomic', label: 'atomic writes', pattern: 'warn', sub: 'all of it, or none' },
        { id: 'm-iso', label: 'isolation', pattern: 'warn', sub: 'a reader never sees a half-write' },
        { id: 'm-schema', label: 'schema enforcement', pattern: 'warn', sub: 'a bad write is rejected' },
        { id: 'm-history', label: 'history', pattern: 'warn', sub: 'what did this look like on Tuesday?' },
      ],
    },
    {
      id: 'why',
      label: 'Structural, not an oversight',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'object storage has no transactions, and no coordinator',
    },
  ],
  edges: [
    { source: 'have', target: 'missing' },
    { source: 'missing', target: 'why' },
  ],
}
