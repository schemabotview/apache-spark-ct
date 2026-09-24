import type { Scene } from '@graphlearning/flow'

export const whyLazyPays: Scene = {
  id: 'exec-why-lazy',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'naive',
      label: 'If Spark ran each line as you wrote it',
      pattern: 'group',
      sub: 'read one billion rows, then throw away all but one thousand of them',
      flow: 'LR',
      children: [
        { id: 'n-read', label: 'read 1B rows', pattern: 'warn', sub: 'every column, every row' },
        { id: 'n-filter', label: 'keep 1K', pattern: 'warn', sub: 'discard 99.9999%' },
      ],
    },
    {
      id: 'lazy',
      label: 'Because it waited, it can rearrange',
      pattern: 'group',
      sub: 'the filter is pushed into the scan, so the rows are never read in the first place',
      cols: 3,
      children: [
        { id: 'l-push', label: 'predicate pushdown', pattern: 'service', sub: 'the filter moves into the read' },
        { id: 'l-prune', label: 'column pruning', pattern: 'service', sub: 'read 3 columns, not 200' },
        { id: 'l-fuse', label: 'operator fusion', pattern: 'service', sub: 'ten steps become one pass' },
      ],
    },
    {
      id: 'price',
      label: 'The price you pay for it',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'errors surface at the action, far from the line that caused them',
    },
  ],
  edges: [
    { source: 'naive', target: 'lazy', label: 'none of this is possible eagerly' },
    { source: 'lazy', target: 'price' },
  ],
}
