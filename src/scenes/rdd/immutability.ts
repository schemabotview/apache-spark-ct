import type { Scene } from '@graphlearning/flow'

export const immutability: Scene = {
  id: 'rdd-immutability',
  padding: 0.14,
  flow: 'LR',
  nodes: [
    {
      id: 'chain',
      label: 'Nothing is ever modified — each step describes a NEW collection',
      pattern: 'group',
      sub: 'rddB does not change rddA; it records that it is rddA with a filter applied',
      flow: 'LR',
      children: [
        { id: 'a', label: 'rddA', pattern: 'storage', sub: 'read from a file' },
        { id: 'b', label: 'rddB', pattern: 'service', sub: '= rddA, filtered' },
        { id: 'c', label: 'rddC', pattern: 'service', sub: '= rddB, mapped' },
      ],
      edges: [
        { source: 'a', target: 'b' },
        { source: 'b', target: 'c' },
      ],
    },
    {
      id: 'buys',
      label: 'What immutability buys',
      pattern: 'group',
      sub: 'three properties that are hard to retrofit and free if you start here',
      cols: 3,
      children: [
        { id: 'bu-safe', label: 'no locking needed', pattern: 'network', sub: 'nothing can be written concurrently' },
        { id: 'bu-redo', label: 'safely recomputable', pattern: 'network', sub: 'the same inputs give the same answer' },
        { id: 'bu-share', label: 'freely shareable', pattern: 'network', sub: 'two branches can read one parent' },
      ],
    },
  ],
  edges: [{ source: 'chain', target: 'buys' }],
}
