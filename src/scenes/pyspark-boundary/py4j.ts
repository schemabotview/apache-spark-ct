import type { Scene } from '@graphlearning/flow'

export const py4j: Scene = {
  id: 'pyb-py4j',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'driver',
      label: 'The driver, which is also two processes',
      pattern: 'group',
      sub: 'your script runs in Python; the plan it builds lives in the JVM beside it',
      cols: 2,
      children: [
        { id: 'd-py', label: 'your Python script', pattern: 'warn', sub: 'df.filter(…).groupBy(…)' },
        { id: 'd-jvm', label: 'the driver JVM', pattern: 'network', sub: 'where the real plan object is' },
      ],
    },
    {
      id: 'gateway',
      label: 'Py4J',
      pattern: 'service',
      icon: 'plug',
      sub: 'a socket gateway · Python holds handles to Java objects',
    },
    {
      id: 'scale',
      label: 'Why this costs nothing',
      pattern: 'group',
      sub: 'one message per API call you write, not per row — a hundred-line script is a few hundred messages',
      cols: 2,
      children: [
        { id: 's-count', label: 'messages ≈ your lines', pattern: 'service', sub: 'and you write few of them' },
        { id: 's-driver', label: 'driver-side only', pattern: 'service', sub: 'Py4J never touches an executor' },
      ],
    },
  ],
  edges: [
    { source: 'driver', target: 'gateway' },
    { source: 'gateway', target: 'scale' },
  ],
}
