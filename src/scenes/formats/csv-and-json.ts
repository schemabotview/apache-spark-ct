import type { Scene } from '@graphlearning/flow'

export const csvAndJson: Scene = {
  id: 'fmt-csv-json',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'missing',
      label: 'What a text format does not have',
      pattern: 'group',
      sub: 'every optimisation in this course rested on metadata — and a CSV has none of it',
      cols: 4,
      children: [
        { id: 'm-schema', label: 'no schema', pattern: 'warn', sub: 'everything is text' },
        { id: 'm-stats', label: 'no statistics', pattern: 'warn', sub: 'nothing to skip on' },
        { id: 'm-cols', label: 'no column layout', pattern: 'warn', sub: 'no pruning possible' },
        { id: 'm-index', label: 'no footer', pattern: 'warn', sub: 'read it or do not' },
      ],
    },
    {
      id: 'infer',
      label: 'inferSchema: an extra pass',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'read once to guess types, then again to load',
    },
    {
      id: 'do',
      label: 'So: declare the schema, and convert once',
      pattern: 'group',
      sub: 'CSV and JSON are interchange formats — fine at the edge of a system, wrong as a place to keep data',
      cols: 2,
      children: [
        { id: 'do-schema', label: 'pass an explicit schema', pattern: 'service', sub: 'one pass, and no wrong guesses' },
        { id: 'do-convert', label: 'land it, then convert', pattern: 'service', sub: 'read CSV once, write Parquet' },
      ],
    },
  ],
  edges: [
    { source: 'missing', target: 'infer' },
    { source: 'infer', target: 'do' },
  ],
}
