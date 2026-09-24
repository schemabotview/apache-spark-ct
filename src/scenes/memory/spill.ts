import type { Scene } from '@graphlearning/flow'

export const spill: Scene = {
  id: 'mem-spill',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'what',
      label: 'Spilling is execution memory running out',
      pattern: 'group',
      sub: 'a sort or an aggregate is accumulating state and the pool will not stretch — so it writes a sorted run out',
      cols: 3,
      children: [
        { id: 'w-fill', label: 'the buffer fills', pattern: 'network', sub: 'mid-operation, not at the start' },
        { id: 'w-out', label: 'a sorted run to disk', pattern: 'warn', sub: 'serialized on the way out' },
        { id: 'w-back', label: 'and read back to merge', pattern: 'warn', sub: 'so you pay for it twice' },
      ],
    },
    {
      id: 'metrics',
      label: 'The two numbers in the UI, which measure different things',
      pattern: 'group',
      sub: 'a large memory figure against a small disk figure is normal — it is the same data, measured twice',
      cols: 2,
      children: [
        { id: 'm-mem', label: 'Spill (Memory)', pattern: 'network', sub: 'the size it had in memory, deserialized' },
        { id: 'm-disk', label: 'Spill (Disk)', pattern: 'network', sub: 'the size written, serialized and compressed' },
      ],
    },
    {
      id: 'fix',
      label: 'And the fix is almost never more memory',
      pattern: 'group',
      sub: 'spilling means the partition was too big — so make the partitions smaller, or stop one being huge',
      cols: 2,
      children: [
        { id: 'f-parts', label: 'more partitions', pattern: 'service', sub: 'each one smaller' },
        { id: 'f-skew', label: 'or fix the skew', pattern: 'service', sub: 'if only ONE task is spilling' },
      ],
    },
  ],
  edges: [
    { source: 'what', target: 'metrics' },
    { source: 'metrics', target: 'fix' },
  ],
}
