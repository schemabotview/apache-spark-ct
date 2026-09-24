import type { Scene } from '@graphlearning/flow'

export const iteratorAndMap: Scene = {
  id: 'pyb-iterator-map',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'Setup runs per batch',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'load a 2 GB model inside one, and it loads once per batch',
    },
    {
      id: 'iter',
      label: 'Iterator UDFs — set up once, then yield per batch',
      pattern: 'group',
      sub: 'Iterator[pd.Series] → Iterator[pd.Series]: everything before the loop runs once per PARTITION',
      cols: 2,
      children: [
        { id: 'i-setup', label: 'before the loop', pattern: 'service', sub: 'load the model · open a connection' },
        { id: 'i-yield', label: 'inside the loop', pattern: 'service', sub: 'yield one result per batch' },
      ],
    },
    {
      id: 'wider',
      label: 'And two that take whole frames',
      pattern: 'group',
      sub: 'when a Series is the wrong shape because your function needs several columns at once',
      cols: 2,
      children: [
        { id: 'w-map', label: 'mapInPandas', pattern: 'network', sub: 'DataFrame in, DataFrame out · any row count' },
        { id: 'w-cog', label: 'applyInPandas', pattern: 'network', sub: 'one group at a time — beware skew' },
      ],
    },
  ],
  edges: [
    { source: 'problem', target: 'iter' },
    { source: 'iter', target: 'wider' },
  ],
}
