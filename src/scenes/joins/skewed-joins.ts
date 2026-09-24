import type { Scene } from '@graphlearning/flow'

// §10 — skewed joins. Salting is the idea people reach for, so it is drawn as the mechanism it is:
// one key becomes many, and the other side is replicated to match. The AQE row is what makes salting
// a last resort rather than a first one on any modern cluster.
export const skewedJoins: Scene = {
  id: 'joins-skewed',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'One key, one task',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: '40% of the orders are one customer — and a stage ends last',
    },
    {
      id: 'aqe',
      label: 'First: let Spark do it',
      pattern: 'group',
      sub: 'spark.sql.adaptive.skewJoin.enabled — it measures the partitions and splits the outliers itself',
      cols: 2,
      children: [
        { id: 'a-factor', label: 'skewedPartitionFactor', pattern: 'service', sub: '5× the median counts as skewed' },
        { id: 'a-size', label: 'thresholdInBytes', pattern: 'service', sub: '256 MB, and both tests must pass' },
      ],
    },
    {
      id: 'salt',
      label: 'Only if that is not enough: salting',
      pattern: 'group',
      sub: 'turn one hot key into n keys by hand — the technique AQE automated, and the reason it rarely earns its complexity now',
      cols: 3,
      children: [
        { id: 's-left', label: 'key → key + rand(0,9)', pattern: 'network', sub: 'the big side: one key becomes ten' },
        { id: 's-right', label: 'explode 0..9', pattern: 'network', sub: 'the small side: each row becomes ten' },
        { id: 's-cost', label: 'the small side ×10', pattern: 'warn', sub: 'and the code is now hard to read' },
      ],
    },
  ],
  edges: [
    { source: 'problem', target: 'aqe' },
    { source: 'aqe', target: 'salt', label: 'still skewed?' },
  ],
}
