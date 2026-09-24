import type { Scene } from '@graphlearning/flow'

export const cacheLocality: Scene = {
  id: 'tun-cache-locality',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'gap',
      label: 'The gap the layout is really exploiting',
      pattern: 'group',
      sub: 'a CPU has not been limited by arithmetic for twenty years — it is limited by waiting for memory',
      cols: 3,
      children: [
        { id: 'l-l1', label: 'L1 cache', pattern: 'service', sub: '~1 ns' },
        { id: 'l-l3', label: 'L3 cache', pattern: 'network', sub: '~20 ns' },
        { id: 'l-ram', label: 'main memory', pattern: 'warn', sub: '~100 ns — a hundred wasted cycles' },
      ],
    },
    {
      id: 'pointer',
      label: 'Pointer-chasing loses',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'each hop is an address the prefetcher cannot predict',
    },
    {
      id: 'contig',
      label: 'Contiguous bytes win it',
      pattern: 'group',
      sub: 'the hardware prefetcher recognises a sequential scan and fetches the next line before it is asked for',
      cols: 2,
      children: [
        { id: 'co-pre', label: 'prefetching works', pattern: 'service', sub: 'the next row is already in cache' },
        { id: 'co-sort', label: 'cache-aware sorting', pattern: 'service', sub: 'sort keys and pointers together' },
      ],
    },
  ],
  edges: [
    { source: 'gap', target: 'pointer' },
    { source: 'pointer', target: 'contig', label: 'so: lay it out flat' },
  ],
}
