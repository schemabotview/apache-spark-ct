import type { Scene } from '@graphlearning/flow'

export const predicatePushdown: Scene = {
  id: 'fmt-predicate-pushdown',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'filter',
      label: 'WHERE cnt > 5000',
      pattern: 'network',
      icon: 'filter',
      sub: 'answered from statistics, before any row is read',
    },
    {
      id: 'groups',
      label: 'The footer already says what is in each row group',
      pattern: 'group',
      sub: 'compare the predicate against min and max — and two of these three need not be opened at all',
      cols: 3,
      children: [
        { id: 'g-1', label: 'group 1 · max 400', pattern: 'warn', sub: 'skipped — nothing can match' },
        { id: 'g-2', label: 'group 2 · max 120', pattern: 'warn', sub: 'skipped — nothing can match' },
        { id: 'g-3', label: 'group 3 · max 9000', pattern: 'service', sub: 'read it — something might' },
      ],
    },
    {
      id: 'sorted',
      label: 'Which is why sortedness is worth money',
      pattern: 'group',
      sub: 'statistics only exclude a group when its range is narrow — and sorting is what makes ranges narrow',
      cols: 2,
      children: [
        { id: 's-rand', label: 'unsorted', pattern: 'warn', sub: 'every group spans 0…9999 — nothing skips' },
        { id: 's-sort', label: 'sorted on the filter column', pattern: 'service', sub: 'each group a tight range' },
      ],
    },
  ],
  edges: [
    { source: 'filter', target: 'groups' },
    { source: 'groups', target: 'sorted' },
  ],
}
