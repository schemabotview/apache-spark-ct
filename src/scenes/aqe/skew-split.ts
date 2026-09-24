import type { Scene } from '@graphlearning/flow'

export const skewSplit: Scene = {
  id: 'aqe-skew-split',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'detect',
      label: 'A partition is skewed only if BOTH tests pass',
      pattern: 'group',
      sub: 'two conditions, because either alone gives false positives on a small or a uniformly large stage',
      cols: 2,
      children: [
        { id: 'd-factor', label: '> 5× the median', pattern: 'network', sub: 'skewedPartitionFactor' },
        { id: 'd-size', label: 'and > 256 MB', pattern: 'network', sub: 'skewedPartitionThresholdInBytes' },
      ],
    },
    {
      id: 'split',
      label: 'The fix: split one side, replicate the other',
      pattern: 'group',
      sub: 'splitting alone would lose matches — the counterpart partition has to be copied to every piece',
      cols: 2,
      children: [
        { id: 'sp-big', label: 'the big one → N pieces', pattern: 'service', sub: 'now N tasks, not one' },
        { id: 'sp-other', label: 'its match → copied N times', pattern: 'service', sub: 'so every piece can still find it' },
      ],
    },
    {
      id: 'limits',
      label: 'And where it stops',
      pattern: 'group',
      sub: 'it needs somewhere to cut — and a single key has no internal boundary to cut along',
      cols: 2,
      children: [
        { id: 'li-key', label: 'one hot KEY cannot split', pattern: 'warn', sub: 'all its rows must meet in one place' },
        { id: 'li-joins', label: 'and it applies to joins', pattern: 'warn', sub: 'sort-merge and shuffled hash' },
      ],
    },
  ],
  edges: [
    { source: 'detect', target: 'split' },
    { source: 'split', target: 'limits' },
  ],
}
