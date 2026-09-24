import type { Scene } from '@graphlearning/flow'

export const theDecision: Scene = {
  id: 'pyb-decision',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'ladder',
      label: 'Try these in order, and stop at the first that works',
      pattern: 'group',
      sub: 'the ordering is not style — each rung down gives up something the engine was doing for you',
      children: [
        { id: 'r1', label: '1 · a built-in function', pattern: 'service', sub: 'stays in the JVM · fuses · optimizable' },
        { id: 'r2', label: '2 · a SQL expression', pattern: 'service', sub: 'still a tree Catalyst can read' },
        { id: 'r3', label: '3 · a pandas UDF', pattern: 'network', sub: 'leaves the JVM, but in batches' },
        { id: 'r4', label: '4 · a plain Python UDF', pattern: 'warn', sub: 'per row · the last resort' },
      ],
      edges: [
        { source: 'r1', target: 'r2' },
        { source: 'r2', target: 'r3' },
        { source: 'r3', target: 'r4' },
      ],
    },
    {
      id: 'check',
      label: 'And check which one you actually got',
      pattern: 'group',
      sub: 'the plan names it, so there is no need to guess whether the fast path was taken',
      cols: 2,
      children: [
        { id: 'c-batch', label: 'BatchEvalPython', pattern: 'warn', sub: 'the per-row path' },
        { id: 'c-arrow', label: 'ArrowEvalPython', pattern: 'service', sub: 'the vectorised path' },
      ],
    },
  ],
  edges: [{ source: 'ladder', target: 'check' }],
}
