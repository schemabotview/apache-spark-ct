import type { Scene } from '@graphlearning/flow'

export const theTransactionLog: Scene = {
  id: 'lake-transaction-log',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'layout',
      label: 'The data does not move — a log is added beside it',
      pattern: 'group',
      sub: 'still Parquet, still readable by anything; what changes is that something now says which files count',
      flow: 'LR',
      children: [
        { id: 'l-data', label: 'part-0000.parquet …', pattern: 'storage', sub: 'exactly as before' },
        { id: 'l-log', label: '_delta_log/', pattern: 'service', sub: '000.json · 001.json · 002.json' },
      ],
    },
    {
      id: 'entries',
      label: 'And each entry is an ordered list of what changed',
      pattern: 'group',
      sub: 'not the data — a record of intent: these files joined the table, these left it, under this schema',
      cols: 3,
      children: [
        { id: 'e-add', label: 'add', pattern: 'service', sub: 'this file is now part of the table' },
        { id: 'e-remove', label: 'remove', pattern: 'warn', sub: 'this one no longer is' },
        { id: 'e-meta', label: 'metadata', pattern: 'network', sub: 'the schema, and the partitioning' },
      ],
    },
    {
      id: 'definition',
      label: 'The LOG is the table',
      pattern: 'service',
      icon: 'bookOpen',
      sub: 'a file with no add entry is invisible, however real it is on disk',
    },
  ],
  edges: [
    { source: 'layout', target: 'entries' },
    { source: 'entries', target: 'definition' },
  ],
}
