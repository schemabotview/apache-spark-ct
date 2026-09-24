import type { Scene } from '@graphlearning/flow'

export const strategySwitch: Scene = {
  id: 'aqe-strategy-switch',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'planned',
      label: 'Planned as a sort-merge join',
      pattern: 'warn',
      icon: 'gitmerge',
      sub: 'the right side ESTIMATED at 4 GB — with no statistics',
    },
    {
      id: 'measured',
      label: 'Then the stage ran, and it measured 3 MB',
      pattern: 'group',
      sub: 'the filter was far more selective than the heuristic assumed — which is normal, not exceptional',
      cols: 2,
      children: [
        { id: 'm-est', label: 'estimated: 4 GB', pattern: 'warn', sub: 'a guess built on a guess' },
        { id: 'm-real', label: 'actual: 3 MB', pattern: 'service', sub: 'counted, from the shuffle files' },
      ],
    },
    {
      id: 'switch',
      label: 'So it switches, mid-flight',
      pattern: 'group',
      sub: 'the sort and the second shuffle are dropped — and a local shuffle reader avoids re-reading what is already there',
      cols: 2,
      children: [
        { id: 'sw-new', label: 'BroadcastHashJoin', pattern: 'service', sub: 'ship 3 MB, join locally' },
        { id: 'sw-saved', label: 'no sort, no second shuffle', pattern: 'service', sub: 'the expensive half, removed' },
      ],
    },
  ],
  edges: [
    { source: 'planned', target: 'measured' },
    { source: 'measured', target: 'switch' },
  ],
}
