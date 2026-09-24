import type { Scene } from '@graphlearning/flow'

export const dppVsStatic: Scene = {
  id: 'aqe-dpp-vs-static',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'static',
      label: 'Static partition pruning — the filter is in your query',
      pattern: 'group',
      sub: 'WHERE year = 2026 · the value is a literal, visible at plan time, and directories are excluded immediately',
      cols: 2,
      children: [
        { id: 'st-when', label: 'decided at plan time', pattern: 'service', sub: 'before anything runs' },
        { id: 'st-need', label: 'needs a literal', pattern: 'network', sub: 'you must have written one' },
      ],
    },
    {
      id: 'dynamic',
      label: 'Dynamic partition pruning — the filter is DERIVED',
      pattern: 'group',
      sub: 'you never wrote a filter on the fact table; Spark worked one out from the other side of the join',
      cols: 2,
      children: [
        { id: 'dy-when', label: 'decided at run time', pattern: 'service', sub: 'after the small side runs' },
        { id: 'dy-need', label: 'needs a join', pattern: 'network', sub: 'and a partitioned fact table' },
      ],
    },
    {
      id: 'note',
      label: 'DPP is not part of AQE',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'separate setting · on by default since Spark 3.0',
    },
  ],
  edges: [
    { source: 'static', target: 'dynamic' },
    { source: 'dynamic', target: 'note' },
  ],
}
