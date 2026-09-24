import type { Scene } from '@graphlearning/flow'

export const columnPruning: Scene = {
  id: 'cat-pruning',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'query',
      label: 'The query: 3 columns',
      pattern: 'network',
      icon: 'filecode',
      sub: 'SELECT dest, sum(cnt) … WHERE country = "IN"',
    },
    {
      id: 'table',
      label: 'The table has two hundred',
      pattern: 'group',
      sub: 'a wide event table — the other 197 columns are never mentioned anywhere in the plan',
      cols: 4,
      children: [
        { id: 't-used1', label: 'dest', pattern: 'service', sub: 'used' },
        { id: 't-used2', label: 'cnt', pattern: 'service', sub: 'used' },
        { id: 't-used3', label: 'country', pattern: 'service', sub: 'used' },
        { id: 't-rest', label: '…197 more', pattern: 'warn', sub: 'never mentioned' },
      ],
    },
    {
      id: 'result',
      label: 'What the scan node ends up saying',
      pattern: 'group',
      sub: 'ReadSchema is the honest record of what will actually be read off disk',
      cols: 2,
      children: [
        { id: 're-schema', label: 'ReadSchema: 3 fields', pattern: 'service', sub: 'struct<dest,cnt,country>' },
        { id: 're-why', label: 'columnar formats deliver', pattern: 'service', sub: 'Parquet skips the other 197 entirely' },
      ],
    },
  ],
  edges: [
    { source: 'query', target: 'table', label: 'ColumnPruning' },
    { source: 'table', target: 'result' },
  ],
}
