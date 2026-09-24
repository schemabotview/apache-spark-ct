import type { Scene } from '@graphlearning/flow'

export const streamStreamJoins: Scene = {
  id: 'str-stream-joins',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'No side can be the build',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'neither is finished — a match may not have arrived yet',
    },
    {
      id: 'buffer',
      label: 'So both sides are buffered in state',
      pattern: 'group',
      sub: 'every unmatched row is kept, in case its partner turns up — and without a bound, that is every row forever',
      cols: 2,
      children: [
        { id: 'b-left', label: 'the left side, buffered', pattern: 'network', sub: 'waiting for matches' },
        { id: 'b-right', label: 'the right side, buffered', pattern: 'network', sub: 'waiting for matches' },
      ],
    },
    {
      id: 'need',
      label: 'Which is why Spark demands two things before it will run one',
      pattern: 'group',
      sub: 'together they put a ceiling on how long a row can usefully be kept — and so on the state',
      cols: 2,
      children: [
        { id: 'n-wm', label: 'a watermark on BOTH sides', pattern: 'service', sub: 'how late each may be' },
        { id: 'n-time', label: 'and a time bound in the ON', pattern: 'service', sub: 'clicks within an hour of the impression' },
      ],
    },
  ],
  edges: [
    { source: 'problem', target: 'buffer' },
    { source: 'buffer', target: 'need' },
  ],
}
