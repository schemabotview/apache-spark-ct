import type { Scene } from '@graphlearning/flow'

export const materializationPoints: Scene = {
  id: 'aqe-materialization',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'stage',
      label: 'A stage runs to completion',
      pattern: 'service',
      icon: 'checkCircle',
      sub: 'every task done, every shuffle file written and closed',
    },
    {
      id: 'known',
      label: 'At that instant, guessing stops being necessary',
      pattern: 'group',
      sub: 'the shuffle files are on disk and have been measured — these are counts, not estimates',
      cols: 3,
      children: [
        { id: 'k-bytes', label: 'bytes per partition', pattern: 'service', sub: 'all 200 of them, exactly' },
        { id: 'k-rows', label: 'rows per partition', pattern: 'service', sub: 'so skew is now visible' },
        { id: 'k-total', label: 'the real output size', pattern: 'service', sub: 'not the estimate from before' },
      ],
    },
    {
      id: 'boundary',
      label: 'So re-plan here',
      pattern: 'network',
      icon: 'gitbranch',
      sub: 'the piece between two of these is a query stage',
    },
  ],
  edges: [
    { source: 'stage', target: 'known' },
    { source: 'known', target: 'boundary' },
  ],
}
