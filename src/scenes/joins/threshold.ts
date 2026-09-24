import type { Scene } from '@graphlearning/flow'

// §3 — the threshold. The number is famous; what it MEASURES is what people get wrong.
export const threshold: Scene = {
  id: 'joins-threshold',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'knob',
      label: 'The broadcast threshold',
      pattern: 'service',
      icon: 'ruler',
      sub: 'autoBroadcast… · 10 MB default · -1 disables it',
    },
    {
      id: 'measures',
      label: 'What the 10 MB is measured against',
      pattern: 'group',
      sub: 'not the file on disk — the optimizer’s ESTIMATE of the side’s size in memory',
      cols: 3,
      children: [
        { id: 'm-file', label: '10 MB of Parquet', pattern: 'storage', sub: 'columnar, dictionary-encoded, compressed' },
        { id: 'm-mem', label: '≈ 100 MB in memory', pattern: 'warn', sub: 'decoded rows, JVM objects, hash-table overhead' },
        { id: 'm-est', label: 'and it is an estimate', pattern: 'warn', sub: 'no table stats → Spark guesses, often badly' },
      ],
    },
    {
      id: 'fails',
      label: 'How it goes wrong',
      pattern: 'group',
      sub: 'both failure directions land on the driver, which is why they are worth knowing',
      cols: 2,
      children: [
        { id: 'f-oom', label: 'driver OOM', pattern: 'warn', sub: 'forced broadcast() on something not small' },
        { id: 'f-timeout', label: 'broadcastTimeout', pattern: 'warn', sub: '300 s to collect and ship — then the job dies' },
      ],
    },
  ],
  edges: [
    { source: 'knob', target: 'measures' },
    { source: 'measures', target: 'fails' },
  ],
}
