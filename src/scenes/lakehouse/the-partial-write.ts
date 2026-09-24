import type { Scene } from '@graphlearning/flow'

export const thePartialWrite: Scene = {
  id: 'lake-partial-write',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'job',
      label: 'A job writing 200 files',
      pattern: 'group',
      sub: 'each task writes its own file, independently, and there is no moment when they all become visible together',
      cols: 3,
      children: [
        { id: 'j-1', label: '140 written', pattern: 'service', sub: 'and already visible' },
        { id: 'j-2', label: 'then it dies', pattern: 'warn', sub: 'OOM, eviction, a bad row' },
        { id: 'j-3', label: '60 never written', pattern: 'warn', sub: 'and nothing records that' },
      ],
    },
    {
      id: 'reader',
      label: 'A reader sees 140 files',
      pattern: 'warn',
      icon: 'eye',
      sub: 'a complete-looking table with 70% of the data, and no way to tell',
    },
    {
      id: 'worse',
      label: 'And the recovery is worse than the failure',
      pattern: 'group',
      sub: 'rerunning appends a second copy of the 140 — so now the table is wrong in a new way',
      cols: 2,
      children: [
        { id: 'w-dupes', label: 're-run → duplicates', pattern: 'warn', sub: 'the first 140, twice' },
        { id: 'w-clean', label: 'clean up → by hand', pattern: 'warn', sub: 'which files were this run’s?' },
      ],
    },
  ],
  edges: [
    { source: 'job', target: 'reader' },
    { source: 'reader', target: 'worse' },
  ],
}
