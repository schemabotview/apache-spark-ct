import type { Scene } from '@graphlearning/flow'

export const eventTime: Scene = {
  id: 'str-event-time',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'two',
      label: 'Two clocks, and only one of them is about your data',
      pattern: 'group',
      sub: 'they are usually close, and the gap is exactly where the difficulty of streaming lives',
      cols: 2,
      children: [
        { id: 'tw-event', label: 'event time', pattern: 'service', sub: 'when it happened · a column in the row' },
        { id: 'tw-proc', label: 'processing time', pattern: 'warn', sub: 'when Spark saw it · an accident of the day' },
      ],
    },
    {
      id: 'gap',
      label: 'Why they come apart',
      pattern: 'group',
      sub: 'every one of these is ordinary operations, not a malfunction — and each widens the gap',
      cols: 3,
      children: [
        { id: 'g-mobile', label: 'a phone was offline', pattern: 'network', sub: 'events arrive hours late' },
        { id: 'g-retry', label: 'a broker retried', pattern: 'network', sub: 'out of order, not just late' },
        { id: 'g-restart', label: 'the job was restarted', pattern: 'network', sub: 'an hour of backlog, at once' },
      ],
    },
    {
      id: 'rule',
      label: 'So aggregate on event time',
      pattern: 'service',
      icon: 'clock',
      sub: 'processing time depends on when the job happened to run',
    },
  ],
  edges: [
    { source: 'two', target: 'gap' },
    { source: 'gap', target: 'rule' },
  ],
}
