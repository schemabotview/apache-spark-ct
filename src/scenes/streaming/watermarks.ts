import type { Scene } from '@graphlearning/flow'

export const watermarks: Scene = {
  id: 'str-watermarks',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'When can state be dropped?',
      pattern: 'warn',
      icon: 'helpCircle',
      sub: 'never, without a rule — 09:00 may arrive tomorrow',
    },
    {
      id: 'promise',
      label: 'A watermark is a promise you make about lateness',
      pattern: 'group',
      sub: 'withWatermark("ts", "10 minutes") — the threshold is subtracted from the latest event time SEEN',
      cols: 2,
      children: [
        { id: 'p-say', label: 'you say: 10 minutes', pattern: 'service', sub: 'nothing later than that matters' },
        { id: 'p-do', label: 'Spark then drops state', pattern: 'service', sub: 'for windows the watermark has passed' },
      ],
    },
    {
      id: 'trade',
      label: 'And the trade it forces you to make explicitly',
      pattern: 'group',
      sub: 'there is no setting that gives you both — the honest answer is a number chosen from your data',
      cols: 2,
      children: [
        { id: 'tr-short', label: 'too short', pattern: 'warn', sub: 'late rows silently dropped' },
        { id: 'tr-long', label: 'too long', pattern: 'warn', sub: 'state grows, latency grows' },
      ],
    },
  ],
  edges: [
    { source: 'problem', target: 'promise' },
    { source: 'promise', target: 'trade' },
  ],
}
