import type { Scene } from '@graphlearning/flow'

export const theMemoryProblem: Scene = {
  id: 'pyb-memory',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'budget',
      label: 'The executor’s memory, as Spark accounts for it',
      pattern: 'group',
      sub: 'Spark sizes, tracks and spills the JVM heap — it can do none of those things to a Python process',
      cols: 2,
      children: [
        { id: 'b-jvm', label: 'the JVM heap', pattern: 'service', sub: 'measured · spills when full' },
        { id: 'b-py', label: 'the Python process', pattern: 'warn', sub: 'unmeasured · cannot spill' },
      ],
    },
    {
      id: 'fail',
      label: 'So the failure arrives from outside Spark',
      pattern: 'group',
      sub: 'the container exceeds its limit and the kernel kills it — there is no Java exception to catch',
      cols: 3,
      children: [
        { id: 'f-oom', label: 'OOMKilled · exit 137', pattern: 'warn', sub: 'the kernel, not the JVM' },
        { id: 'f-nostack', label: 'no stack trace', pattern: 'warn', sub: 'nothing in the driver log explains it' },
        { id: 'f-conf', label: 'so budget for it', pattern: 'service', sub: 'memoryOverhead · pyspark.memory' },
      ],
    },
  ],
  edges: [{ source: 'budget', target: 'fail' }],
}
