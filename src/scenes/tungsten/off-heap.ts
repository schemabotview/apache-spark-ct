import type { Scene } from '@graphlearning/flow'

export const offHeap: Scene = {
  id: 'tun-off-heap',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'onheap',
      label: 'On-heap — inside the JVM',
      pattern: 'group',
      sub: 'Tungsten rows still live in byte arrays the JVM owns, so the GC still has to consider the array',
      cols: 2,
      children: [
        { id: 'on-who', label: 'the JVM manages it', pattern: 'network', sub: 'allocation and collection' },
        { id: 'on-cost', label: 'still traced', pattern: 'warn', sub: 'one object, but still an object' },
      ],
    },
    {
      id: 'offheap',
      label: 'Off-heap — memory Spark manages itself',
      pattern: 'group',
      sub: 'allocated outside the JVM heap through Unsafe · spark.memory.offHeap.enabled + a size',
      cols: 2,
      children: [
        { id: 'off-who', label: 'Spark manages it', pattern: 'service', sub: 'explicit allocate and free' },
        { id: 'off-cost', label: 'the GC never sees it', pattern: 'service', sub: 'no tracing at all' },
      ],
    },
    {
      id: 'honest',
      label: 'And it is not a free win',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'two pools to size by hand · measure before enabling',
    },
  ],
  edges: [
    { source: 'onheap', target: 'offheap', label: 'the further step' },
    { source: 'offheap', target: 'honest' },
  ],
}
