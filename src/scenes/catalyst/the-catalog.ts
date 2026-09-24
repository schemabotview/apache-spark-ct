import type { Scene } from '@graphlearning/flow'

export const theCatalog: Scene = {
  id: 'cat-catalog',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'catalog',
      label: 'The catalog',
      pattern: 'service',
      icon: 'bookOpen',
      sub: 'the only thing that knows what a name means',
      cols: 1,
      children: [
        { id: 'c-tables', label: 'tables and views', pattern: 'network', sub: 'name → location and format' },
        { id: 'c-schema', label: 'columns and types', pattern: 'network', sub: 'dest is a string, cnt is a bigint' },
        { id: 'c-fns', label: 'functions', pattern: 'network', sub: 'built-ins, and your UDFs' },
        { id: 'c-stats', label: 'statistics', pattern: 'network', sub: 'row counts and sizes, IF computed' },
      ],
    },
    {
      id: 'sources',
      label: 'Where it comes from',
      pattern: 'group',
      sub: 'a session always has one — in-memory by default, and a shared metastore when tables outlive the session',
      cols: 2,
      children: [
        { id: 's-session', label: 'the session', pattern: 'network', sub: 'temp views, createOrReplaceTempView' },
        { id: 's-meta', label: 'an external metastore', pattern: 'network', sub: 'Hive, Glue, Unity — shared, durable' },
      ],
    },
    {
      id: 'stats',
      label: 'Statistics are OPTIONAL',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'no ANALYZE TABLE → the optimizer is guessing sizes',
    },
  ],
  edges: [
    { source: 'catalog', target: 'sources', label: 'backed by' },
    { source: 'catalog', target: 'stats' },
  ],
}
