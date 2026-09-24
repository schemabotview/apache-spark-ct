import type { Scene } from '@graphlearning/flow'

export const dataframeIllusion: Scene = {
  id: 'pyb-illusion',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'wrote',
      label: 'What you wrote, in Python',
      pattern: 'network',
      icon: 'filecode',
      sub: 'df.filter(col("country") == "IN").groupBy("dest").count()',
    },
    {
      id: 'became',
      label: 'What it became',
      pattern: 'group',
      sub: 'the Python objects were builders — they described a plan and then had nothing more to do',
      cols: 3,
      children: [
        { id: 'b-plan', label: 'a plan in the JVM', pattern: 'service', sub: 'built over Py4J, once' },
        { id: 'b-opt', label: 'optimized by Catalyst', pattern: 'service', sub: 'the same rules as Scala' },
        { id: 'b-run', label: 'run as generated Java', pattern: 'service', sub: 'on the executors' },
      ],
    },
    {
      id: 'zero',
      label: 'Python in the data: zero',
      pattern: 'service',
      icon: 'check',
      sub: 'which is why pure DataFrame PySpark is not slower than Scala',
    },
  ],
  edges: [
    { source: 'wrote', target: 'became' },
    { source: 'became', target: 'zero' },
  ],
}
