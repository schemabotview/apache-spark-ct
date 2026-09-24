import type { Scene } from '@graphlearning/flow'

export const theFooter: Scene = {
  id: 'fmt-footer',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'read',
      label: 'Start at the END',
      pattern: 'service',
      icon: 'bookOpen',
      sub: 'the last 8 bytes say how far back the footer starts',
    },
    {
      id: 'holds',
      label: 'What the footer holds',
      pattern: 'group',
      sub: 'everything needed to decide what NOT to read, available before any data is touched',
      cols: 2,
      children: [
        { id: 'h-schema', label: 'the schema', pattern: 'network', sub: 'names, types, nesting' },
        { id: 'h-offsets', label: 'offsets', pattern: 'network', sub: 'where each chunk begins' },
        { id: 'h-stats', label: 'min / max per chunk', pattern: 'service', sub: 'the pushdown lives on this' },
        { id: 'h-nulls', label: 'null counts', pattern: 'service', sub: 'and distinct counts, sometimes' },
      ],
    },
    {
      id: 'consequence',
      label: 'So it is not streamable',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'a truncated file is unreadable, not partly readable',
    },
  ],
  edges: [
    { source: 'read', target: 'holds' },
    { source: 'holds', target: 'consequence' },
  ],
}
