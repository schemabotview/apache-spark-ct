import type { Scene } from '@graphlearning/flow'

export const unresolvedPlan: Scene = {
  id: 'cat-unresolved',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'plan',
      label: 'The unresolved logical plan — real nodes, unknown names',
      pattern: 'group',
      sub: 'the grammar is fine, so a tree exists; but nothing in it has been checked against anything real',
      children: [
        { id: 'u-proj', label: "Project ['dest, 'total]", pattern: 'warn', sub: "the ' prefix means UNRESOLVED" },
        { id: 'u-agg', label: "Aggregate ['dest]", pattern: 'warn', sub: "[sum('cnt)] — is cnt a number? unknown" },
        { id: 'u-filter', label: "Filter ('country = 'IN')", pattern: 'warn', sub: 'does country exist? unknown' },
        { id: 'u-rel', label: "UnresolvedRelation [flights]", pattern: 'warn', sub: 'which table is that?' },
      ],
      edges: [
        { source: 'u-rel', target: 'u-filter' },
        { source: 'u-filter', target: 'u-agg' },
        { source: 'u-agg', target: 'u-proj' },
      ],
    },
    {
      id: 'knows',
      label: 'What it knows, and what it does not',
      pattern: 'group',
      sub: 'this is the boundary between a syntax error and an analysis error, and it is why they arrive at different times',
      cols: 2,
      children: [
        { id: 'k-yes', label: 'the shape is valid', pattern: 'service', sub: 'a SELECT with a GROUP BY and a WHERE' },
        { id: 'k-no', label: 'every name is a guess', pattern: 'warn', sub: 'table, column, type — all unchecked' },
      ],
    },
  ],
  edges: [{ source: 'plan', target: 'knows' }],
}
