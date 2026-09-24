import type { Scene } from '@graphlearning/flow'

export const theCostModel: Scene = {
  id: 'cat-cost-model',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'inputs',
      label: 'What the choice is made from',
      pattern: 'group',
      sub: 'estimated sizes — and "estimated" is the load-bearing word in this entire course',
      cols: 3,
      children: [
        { id: 'i-stats', label: 'catalog statistics', pattern: 'network', sub: 'if ANALYZE TABLE ever ran' },
        { id: 'i-files', label: 'file sizes', pattern: 'network', sub: 'compressed bytes on disk' },
        { id: 'i-guess', label: 'and heuristics', pattern: 'warn', sub: 'a filter keeps…some fraction?' },
      ],
    },
    {
      id: 'decide',
      label: 'One candidate wins',
      pattern: 'service',
      icon: 'check',
      sub: 'e.g. the right side estimates under 10 MB → BroadcastHashJoin',
    },
    {
      id: 'wrong',
      label: 'When the estimate is wrong',
      pattern: 'group',
      sub: 'a bad estimate does not make Spark choose badly sometimes — it makes it choose badly on every run, identically',
      cols: 2,
      children: [
        { id: 'w-fix', label: 'ANALYZE TABLE', pattern: 'service', sub: 'fixes the cause, cheaply' },
        { id: 'w-aqe', label: 'or let AQE re-decide', pattern: 'service', sub: 'with real numbers, after a shuffle' },
      ],
    },
  ],
  edges: [
    { source: 'inputs', target: 'decide' },
    { source: 'decide', target: 'wrong' },
  ],
}
