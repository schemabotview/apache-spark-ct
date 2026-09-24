import type { Scene } from '@graphlearning/flow'

export const windows: Scene = {
  id: 'str-windows',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'why',
      label: 'A bounded question',
      pattern: 'service',
      icon: 'crop',
      sub: '"how many?" has no answer · "how many by 09:10?" does',
    },
    {
      id: 'kinds',
      label: 'Three shapes of window',
      pattern: 'group',
      sub: 'the cost differs: a row lands in one tumbling window, and in several sliding ones',
      cols: 3,
      children: [
        { id: 'k-tumb', label: 'tumbling', pattern: 'service', sub: 'fixed, no overlap · one window per row' },
        { id: 'k-slide', label: 'sliding', pattern: 'network', sub: 'overlapping · a row counts in several' },
        { id: 'k-sess', label: 'session', pattern: 'network', sub: 'grows with activity, closes on a gap' },
      ],
    },
    {
      id: 'cost',
      label: 'Each window is state',
      pattern: 'warn',
      icon: 'database',
      sub: 'so a window that never closes is a leak',
    },
  ],
  edges: [
    { source: 'why', target: 'kinds' },
    { source: 'kinds', target: 'cost' },
  ],
}
