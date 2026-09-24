import type { Scene } from '@graphlearning/flow'

export const schemaEvolution: Scene = {
  id: 'fmt-schema-evolution',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'safe',
      label: 'What you can change safely',
      pattern: 'group',
      sub: 'Parquet matches columns by NAME, not by position — which is what makes these safe',
      cols: 2,
      children: [
        { id: 'sa-add', label: 'add a column', pattern: 'service', sub: 'old files read it as null' },
        { id: 'sa-reorder', label: 'reorder columns', pattern: 'service', sub: 'position was never load-bearing' },
      ],
    },
    {
      id: 'unsafe',
      label: 'What you cannot',
      pattern: 'group',
      sub: 'each of these produces nulls or an error at read time, in files written before the change',
      cols: 3,
      children: [
        { id: 'un-rename', label: 'rename a column', pattern: 'warn', sub: 'it is a new column; the old is gone' },
        { id: 'un-type', label: 'narrow a type', pattern: 'warn', sub: 'long → int has nowhere to put the value' },
        { id: 'un-drop', label: 'drop and re-add', pattern: 'warn', sub: 'with a different type — worst of all' },
      ],
    },
    {
      id: 'merge',
      label: 'mergeSchema: off, rightly',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'it reads EVERY footer — ruinous for a million files',
    },
  ],
  edges: [
    { source: 'safe', target: 'unsafe' },
    { source: 'unsafe', target: 'merge' },
  ],
}
