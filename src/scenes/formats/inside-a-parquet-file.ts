import type { Scene } from '@graphlearning/flow'

export const insideAParquetFile: Scene = {
  id: 'fmt-inside-parquet',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'file',
      label: 'One Parquet file',
      pattern: 'group',
      sub: 'hybrid, not purely columnar: split by rows first, then columnar INSIDE each split',
      children: [
        {
          id: 'rg1',
          label: 'Row group 1 — ~128 MB of rows',
          pattern: 'service',
          sub: 'a horizontal slice, self-contained: it can be read without any other row group',
          flow: 'LR',
          children: [
            { id: 'rg1-a', label: 'chunk: dest', pattern: 'network', sub: 'pages · ~1 MB each' },
            { id: 'rg1-b', label: 'chunk: country', pattern: 'network', sub: 'pages · ~1 MB each' },
            { id: 'rg1-c', label: 'chunk: cnt', pattern: 'network', sub: 'pages · ~1 MB each' },
          ],
        },
        { id: 'rg2', label: 'Row group 2', pattern: 'service', sub: 'the same three column chunks, for the next slice of rows' },
        { id: 'footer', label: 'The footer', pattern: 'warn', sub: 'the schema, and statistics for every chunk above' },
      ],
      edges: [
        { source: 'rg1', target: 'rg2' },
        { source: 'rg2', target: 'footer' },
      ],
    },
    {
      id: 'why',
      label: 'Why hybrid',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'a row group is skippable whole — and one task reads one',
    },
  ],
  edges: [{ source: 'file', target: 'why' }],
}
