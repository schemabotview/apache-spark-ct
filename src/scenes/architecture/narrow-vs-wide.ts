import type { Scene } from '@graphlearning/flow'

// §2.6 — the dependency shape, drawn literally. Narrow: each output partition reads one input
// partition (straight lanes). Wide: each output partition reads from every input (all-to-all), which
// is a shuffle and therefore a stage boundary.
export const narrowVsWide: Scene = {
  id: 'narrow-vs-wide',
  title: 'Narrow and wide dependencies',
  flow: 'TB',
  nodes: [
    {
      id: 'narrow-deps',
      label: 'Narrow',
      sub: 'where, select',
      pattern: 'service',
      flow: 'TB',
      children: [
        { id: 'narrow-in-1', label: 'P1', variant: 'chip' },
        { id: 'narrow-in-2', label: 'P2', variant: 'chip' },
        { id: 'narrow-in-3', label: 'P3', variant: 'chip' },
        { id: 'narrow-out-1', label: 'P1′', variant: 'chip' },
        { id: 'narrow-out-2', label: 'P2′', variant: 'chip' },
        { id: 'narrow-out-3', label: 'P3′', variant: 'chip' },
      ],
      edges: [
        { source: 'narrow-in-1', target: 'narrow-out-1' },
        { source: 'narrow-in-2', target: 'narrow-out-2' },
        { source: 'narrow-in-3', target: 'narrow-out-3' },
      ],
    },
    {
      id: 'wide-deps',
      label: 'Wide',
      sub: 'groupBy, join',
      pattern: 'warn',
      flow: 'TB',
      children: [
        { id: 'wide-in-1', label: 'P1', variant: 'chip' },
        { id: 'wide-in-2', label: 'P2', variant: 'chip' },
        { id: 'wide-in-3', label: 'P3', variant: 'chip' },
        { id: 'wide-out-1', label: 'S1', variant: 'chip' },
        { id: 'wide-out-2', label: 'S2', variant: 'chip' },
      ],
      edges: [
        { source: 'wide-in-1', target: 'wide-out-1' },
        { source: 'wide-in-1', target: 'wide-out-2' },
        { source: 'wide-in-2', target: 'wide-out-1' },
        { source: 'wide-in-2', target: 'wide-out-2' },
        { source: 'wide-in-3', target: 'wide-out-1' },
        { source: 'wide-in-3', target: 'wide-out-2' },
      ],
    },
  ],
  edges: [],
}
