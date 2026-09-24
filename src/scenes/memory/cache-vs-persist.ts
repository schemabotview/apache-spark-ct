import type { Scene } from '@graphlearning/flow'

export const cacheVsPersist: Scene = {
  id: 'mem-cache-vs-persist',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'cache',
      label: 'cache()',
      pattern: 'service',
      icon: 'zap',
      sub: 'persist() with the default level, and nothing else',
    },
    {
      id: 'defaults',
      label: 'And the default is not the same for both APIs',
      pattern: 'group',
      sub: 'a genuine trap: the same method name means two different things depending on what you call it on',
      cols: 2,
      children: [
        { id: 'd-rdd', label: 'rdd.cache()', pattern: 'warn', sub: 'MEMORY_ONLY — drops what does not fit' },
        { id: 'd-df', label: 'df.cache()', pattern: 'service', sub: 'MEMORY_AND_DISK — spills instead' },
      ],
    },
    {
      id: 'lazy',
      label: 'Both are lazy. unpersist() is not.',
      pattern: 'group',
      sub: 'marking something cached does nothing until an action fills it — and a partial action fills it partially',
      cols: 2,
      children: [
        { id: 'l-fill', label: 'df.cache(); df.count()', pattern: 'service', sub: 'count() is what materialises it' },
        { id: 'l-partial', label: 'df.cache(); df.take(1)', pattern: 'warn', sub: 'caches ONE partition, silently' },
      ],
    },
  ],
  edges: [
    { source: 'cache', target: 'defaults' },
    { source: 'defaults', target: 'lazy' },
  ],
}
