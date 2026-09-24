import type { Scene } from '@graphlearning/flow'

export const encodingCompression: Scene = {
  id: 'fmt-encoding',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'two',
      label: 'Two different steps people say in one breath',
      pattern: 'group',
      sub: 'encoding understands the data and is type-aware; compression does not and is not',
      cols: 2,
      children: [
        { id: 't-enc', label: 'encoding', pattern: 'service', sub: 'a smarter representation of the values' },
        { id: 't-comp', label: 'compression', pattern: 'network', sub: 'generic squeezing, applied after' },
      ],
    },
    {
      id: 'encodings',
      label: 'The encodings that do the real work',
      pattern: 'group',
      sub: 'each exploits a property a COLUMN has and a row never does — repetition, ordering, narrow range',
      cols: 3,
      children: [
        { id: 'e-dict', label: 'dictionary', pattern: 'service', sub: '"United States" → 0, stored once' },
        { id: 'e-rle', label: 'run-length', pattern: 'service', sub: '0,0,0,0,0 → (0 × 5)' },
        { id: 'e-delta', label: 'delta', pattern: 'service', sub: 'store differences, not values' },
      ],
    },
    {
      id: 'codecs',
      label: 'And then a codec on top',
      pattern: 'group',
      sub: 'snappy is the default because decompression speed usually matters more than ratio',
      cols: 3,
      children: [
        { id: 'c-snappy', label: 'snappy', pattern: 'service', sub: 'fast · splittable · the default' },
        { id: 'c-zstd', label: 'zstd', pattern: 'network', sub: 'smaller, nearly as fast — worth testing' },
        { id: 'c-gzip', label: 'gzip', pattern: 'warn', sub: 'smallest, slowest to read' },
      ],
    },
  ],
  edges: [
    { source: 'two', target: 'encodings' },
    { source: 'encodings', target: 'codecs' },
  ],
}
