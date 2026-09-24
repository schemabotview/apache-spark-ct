import type { Scene } from '@graphlearning/flow'

export const offHeap: Scene = {
  id: 'mem-off-heap',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'what',
      label: 'What turning it on actually does',
      pattern: 'group',
      sub: 'spark.memory.offHeap.enabled plus a size — and the size is a SECOND budget, not a share of the first',
      cols: 2,
      children: [
        { id: 'w-alloc', label: 'Spark allocates directly', pattern: 'service', sub: 'through Unsafe, outside the heap' },
        { id: 'w-gc', label: 'the GC never traces it', pattern: 'service', sub: 'so it adds nothing to pause time' },
      ],
    },
    {
      id: 'cost',
      label: 'And what it costs you',
      pattern: 'group',
      sub: 'you have traded one number you had to get right for two numbers you have to get right',
      cols: 3,
      children: [
        { id: 'c-two', label: 'two pools to size', pattern: 'warn', sub: 'plenty of one, none of the other' },
        { id: 'c-k8s', label: 'it counts in the container', pattern: 'warn', sub: 'raise memoryOverhead, or be OOMKilled' },
        { id: 'c-leak', label: 'and leaks are yours', pattern: 'warn', sub: 'you opted out of the collector' },
      ],
    },
    {
      id: 'when',
      label: 'Only if GC is measured',
      pattern: 'service',
      icon: 'activity',
      sub: 'a third of task time — otherwise it changes nothing',
    },
  ],
  edges: [
    { source: 'what', target: 'cost' },
    { source: 'cost', target: 'when' },
  ],
}
