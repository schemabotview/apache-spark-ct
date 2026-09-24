import type { Scene } from '@graphlearning/flow'

export const smallFileProblem: Scene = {
  id: 'fmt-small-files',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'cause',
      label: 'How a million tiny files happen',
      pattern: 'group',
      sub: 'nobody chooses this — it is what a streaming job or an over-partitioned write does by default',
      cols: 2,
      children: [
        { id: 'ca-stream', label: 'a job writing every minute', pattern: 'warn', sub: 'one file per partition, per run' },
        { id: 'ca-parts', label: '200 partitions × 365 days', pattern: 'warn', sub: 'by design, and nobody noticed' },
      ],
    },
    {
      id: 'costs',
      label: 'Three costs, and the first is the worst',
      pattern: 'group',
      sub: 'the driver has to enumerate every file before any executor starts — on object storage that is an API call each',
      cols: 3,
      children: [
        { id: 'co-list', label: 'listing, on the driver', pattern: 'warn', sub: 'minutes before the job begins' },
        { id: 'co-task', label: 'one task per file, at least', pattern: 'warn', sub: 'scheduling a task to read 4 KB' },
        { id: 'co-foot', label: 'a footer read per file', pattern: 'warn', sub: 'the metadata outweighs the data' },
      ],
    },
    {
      id: 'fix',
      label: 'The fixes, in order of how often they are the right one',
      pattern: 'group',
      sub: 'aim for files in the region of 128 MB to 1 GB — the exact number matters far less than the order of magnitude',
      cols: 3,
      children: [
        { id: 'fx-part', label: 'repartition before write', pattern: 'service', sub: 'control the file count directly' },
        { id: 'fx-compact', label: 'compact on a schedule', pattern: 'service', sub: 'rewrite yesterday into few files' },
        { id: 'fx-less', label: 'partition by less', pattern: 'service', sub: 'day, not hour; drop a level' },
      ],
    },
  ],
  edges: [
    { source: 'cause', target: 'costs' },
    { source: 'costs', target: 'fix' },
  ],
}
