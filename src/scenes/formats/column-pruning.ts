import type { Scene } from '@graphlearning/flow'

export const columnPruning: Scene = {
  id: 'fmt-column-pruning',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'ask',
      label: 'SELECT dest, cnt',
      pattern: 'network',
      icon: 'filecode',
      sub: 'two attributes named → two chunks fetched, of 200',
    },
    {
      id: 'reads',
      label: 'What the reader actually fetches',
      pattern: 'group',
      sub: 'offsets from the footer point straight at the two chunks — everything else is seeked past',
      cols: 4,
      children: [
        { id: 'rd-1', label: 'chunk: dest', pattern: 'service', sub: 'read' },
        { id: 'rd-2', label: 'chunk: cnt', pattern: 'service', sub: 'read' },
        { id: 'rd-3', label: '198 other chunks', pattern: 'warn', sub: 'never touched' },
        { id: 'rd-4', label: 'bytes read: ~1%', pattern: 'service', sub: 'not 100% then filtered' },
      ],
    },
    {
      id: 'star',
      label: 'The real cost of *',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'it is not verbosity — it is a 100× increase in bytes read',
    },
  ],
  edges: [
    { source: 'ask', target: 'reads' },
    { source: 'reads', target: 'star' },
  ],
}
