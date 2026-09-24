import type { Scene } from '@graphlearning/flow'

export const theAnalyzer: Scene = {
  id: 'cat-analyzer',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'before',
      label: 'Before — every name a guess',
      pattern: 'group',
      sub: 'the same four nodes as the last frame, still carrying apostrophes',
      flow: 'LR',
      children: [
        { id: 'b-rel', label: "UnresolvedRelation", pattern: 'warn', sub: '[flights]' },
        { id: 'b-filter', label: "Filter ('country = IN)", pattern: 'warn', sub: "'country is a name, not a column" },
      ],
      edges: [{ source: 'b-rel', target: 'b-filter' }],
    },
    {
      id: 'after',
      label: 'After — every name bound to a real column, with a type and an id',
      pattern: 'group',
      sub: 'the apostrophes are gone; #7 and #11 are attribute ids, unique for the life of the plan',
      flow: 'LR',
      children: [
        { id: 'a-rel', label: 'Relation flights', pattern: 'service', sub: 'parquet · s3://…/flights' },
        { id: 'a-filter', label: 'Filter (country#7 = IN)', pattern: 'service', sub: 'country#7: string' },
      ],
      edges: [{ source: 'a-rel', target: 'a-filter' }],
    },
    {
      id: 'rejects',
      label: 'Or it refuses — and this is the error you get FAST',
      pattern: 'group',
      sub: 'analysis runs as you build the plan, long before any action, which is why a typo fails immediately',
      cols: 3,
      children: [
        { id: 'r-col', label: 'no such column', pattern: 'warn', sub: 'cannot resolve `dst`' },
        { id: 'r-tbl', label: 'no such table', pattern: 'warn', sub: 'Table or view not found' },
        { id: 'r-amb', label: 'ambiguous', pattern: 'warn', sub: 'both sides of a join have `id`' },
      ],
    },
  ],
  edges: [
    { source: 'before', target: 'after', label: 'the analyzer, using the catalog' },
    { source: 'after', target: 'rejects' },
  ],
}
