import type { Scene } from '@graphlearning/flow'

export const updatesAndDeletes: Scene = {
  id: 'lake-updates',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'Parquet is immutable',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'no byte changes in place — the file must be replaced',
    },
    {
      id: 'cow',
      label: 'Copy-on-write — rewrite the whole file',
      pattern: 'group',
      sub: 'read the file containing the row, write a new one with the change, then add the new and remove the old in ONE entry',
      cols: 2,
      children: [
        { id: 'c-read', label: 'fast to read after', pattern: 'service', sub: 'nothing to reconcile' },
        { id: 'c-write', label: 'slow to write', pattern: 'warn', sub: 'one row changed → one file rewritten' },
      ],
    },
    {
      id: 'mor',
      label: 'Merge-on-read — write the change beside it',
      pattern: 'group',
      sub: 'record that a row is deleted, or write the new version alongside, and let the reader reconcile them',
      cols: 2,
      children: [
        { id: 'm-write', label: 'fast to write', pattern: 'service', sub: 'nothing is rewritten' },
        { id: 'm-read', label: 'slower to read', pattern: 'warn', sub: 'every read applies the deltas' },
      ],
    },
  ],
  edges: [
    { source: 'problem', target: 'cow' },
    { source: 'cow', target: 'mor', label: 'the other trade' },
  ],
}
