import type { Scene } from '@graphlearning/flow'

export const partitionedDirectories: Scene = {
  id: 'fmt-partitioned-dirs',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'layout',
      label: 'The directory names ARE an index',
      pattern: 'group',
      sub: 'written by partitionBy("year","month") — and the values are not stored in the files at all',
      flow: 'LR',
      children: [
        { id: 'd-1', label: 'year=2024/month=01', pattern: 'storage', sub: 'part-0000.parquet …' },
        { id: 'd-2', label: 'year=2024/month=02', pattern: 'storage', sub: 'part-0000.parquet …' },
        { id: 'd-3', label: 'year=2026/month=09', pattern: 'storage', sub: 'part-0000.parquet …' },
      ],
    },
    {
      id: 'free',
      label: 'Which makes the column free, twice over',
      pattern: 'group',
      sub: 'it costs no bytes on disk, and a filter on it is answered by listing paths rather than reading data',
      cols: 2,
      children: [
        { id: 'f-space', label: 'not stored', pattern: 'service', sub: 'inferred from the path' },
        { id: 'f-skip', label: 'whole directories skipped', pattern: 'service', sub: 'before a file is opened' },
      ],
    },
    {
      id: 'wrong',
      label: 'And how it goes wrong',
      pattern: 'group',
      sub: 'a partition column must be low-cardinality — the failure is thousands of directories with one tiny file each',
      cols: 2,
      children: [
        { id: 'wr-high', label: 'partitioning by user_id', pattern: 'warn', sub: 'a million directories' },
        { id: 'wr-nofilter', label: 'or nobody filters on it', pattern: 'warn', sub: 'all cost, no benefit' },
      ],
    },
  ],
  edges: [
    { source: 'layout', target: 'free' },
    { source: 'free', target: 'wrong' },
  ],
}
