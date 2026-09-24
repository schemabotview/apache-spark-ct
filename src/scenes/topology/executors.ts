import type { Scene } from '@graphlearning/flow'

export const executors: Scene = {
  id: 'topology-executors',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'inside',
      label: 'Inside one executor',
      pattern: 'group',
      sub: 'a JVM with N cores — and the cores are the unit of parallelism, not the executors',
      cols: 2,
      children: [
        {
          id: 'slots',
          label: 'Task slots',
          pattern: 'service',
          sub: 'one core, one task, at a time',
          cols: 2,
          children: [
            { id: 's1', label: 'core 1', pattern: 'network', sub: 'task 14', variant: 'tile' },
            { id: 's2', label: 'core 2', pattern: 'network', sub: 'task 15', variant: 'tile' },
            { id: 's3', label: 'core 3', pattern: 'network', sub: 'task 16', variant: 'tile' },
            { id: 's4', label: 'core 4', pattern: 'network', sub: 'idle', variant: 'tile' },
          ],
        },
        {
          id: 'mem',
          label: 'Its memory',
          pattern: 'service',
          sub: 'shared by every task in this JVM',
          cols: 1,
          children: [
            { id: 'm-exec', label: 'execution', pattern: 'network', sub: 'shuffles, joins, sorts' },
            { id: 'm-store', label: 'storage', pattern: 'network', sub: 'cached partitions' },
          ],
        },
      ],
    },
    {
      id: 'sizing',
      label: 'Why very large executors are a trap',
      pattern: 'group',
      sub: 'the usual advice is ~5 cores each: enough to share a cached partition, few enough to keep GC and HDFS throughput sane',
      cols: 2,
      children: [
        { id: 'z-gc', label: 'one huge JVM', pattern: 'warn', sub: 'GC pauses grow with the heap' },
        { id: 'z-tiny', label: 'many tiny ones', pattern: 'warn', sub: 'no sharing, broadcast copied to each' },
      ],
    },
  ],
  edges: [{ source: 'inside', target: 'sizing' }],
}
