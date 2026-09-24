import type { Scene } from '@graphlearning/flow'

export const theExecutorBudget: Scene = {
  id: 'mem-executor-budget',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'heap',
      label: 'One executor’s JVM heap, carved up',
      pattern: 'group',
      sub: 'spark.executor.memory is the heap — and rather less than all of it is yours to use',
      children: [
        { id: 'h-res', label: 'reserved · 300 MB', pattern: 'warn', sub: 'Spark’s own internals · not negotiable' },
        { id: 'h-unified', label: 'the unified pool · 60%', pattern: 'service', sub: 'spark.memory.fraction — execution AND storage' },
        { id: 'h-user', label: 'user memory · the rest', pattern: 'network', sub: 'your objects, UDF state, anything you allocate' },
      ],
    },
    {
      id: 'outside',
      label: 'And a fourth region, outside the heap entirely',
      pattern: 'group',
      sub: 'memoryOverhead — the container has to hold this too, and the kernel enforces it, not the JVM',
      cols: 3,
      children: [
        { id: 'o-stacks', label: 'thread stacks', pattern: 'network', sub: 'one per task' },
        { id: 'o-net', label: 'network buffers', pattern: 'network', sub: 'shuffle transfers' },
        { id: 'o-py', label: 'Python workers', pattern: 'warn', sub: 'if you use them at all' },
      ],
    },
    {
      id: 'sum',
      label: '16 GB in, ~9 GB usable',
      pattern: 'warn',
      icon: 'calculator',
      sub: 'which is why "it has 16 GB, why did it OOM" is the wrong question',
    },
  ],
  edges: [
    { source: 'heap', target: 'outside' },
    { source: 'outside', target: 'sum' },
  ],
}
