import type { Scene } from '@graphlearning/flow'

export const rowVsColumn: Scene = {
  id: 'fmt-row-vs-column',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'row',
      label: 'Row-wise — all of row 1, then all of row 2',
      pattern: 'group',
      sub: 'CSV, JSON, Avro, and every OLTP database — built for "give me this one record, all of it"',
      flow: 'LR',
      children: [
        { id: 'r1', label: 'r1: id, dest, cnt…', pattern: 'network', sub: 'all 200 columns' },
        { id: 'r2', label: 'r2: id, dest, cnt…', pattern: 'network', sub: 'all 200 columns' },
        { id: 'r3', label: 'r3: id, dest, cnt…', pattern: 'network', sub: 'all 200 columns' },
      ],
    },
    {
      id: 'col',
      label: 'Columnar — all of column 1, then all of column 2',
      pattern: 'group',
      sub: 'Parquet and ORC — built for "give me these three columns, for all ten billion rows"',
      flow: 'LR',
      children: [
        { id: 'c1', label: 'every id', pattern: 'service', sub: 'contiguous' },
        { id: 'c2', label: 'every dest', pattern: 'service', sub: 'contiguous' },
        { id: 'c3', label: 'every cnt', pattern: 'service', sub: 'contiguous' },
      ],
    },
    {
      id: 'why',
      label: 'Which shape matches an analytical query',
      pattern: 'group',
      sub: 'analytics reads few columns of many rows — the opposite of what a row layout is good at',
      cols: 2,
      children: [
        { id: 'w-skip', label: 'skip 197 columns', pattern: 'service', sub: 'never read, not read-then-discard' },
        { id: 'w-comp', label: 'and compress better', pattern: 'service', sub: 'like values sit next to like values' },
      ],
    },
  ],
  edges: [
    { source: 'row', target: 'col' },
    { source: 'col', target: 'why' },
  ],
}
