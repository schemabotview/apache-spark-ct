import type { Scene } from '@graphlearning/flow'

export const twoProcesses: Scene = {
  id: 'pyb-two-processes',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'cluster',
      label: 'What is actually running on one worker node',
      pattern: 'group',
      sub: 'not one process with two languages in it — two operating-system processes that talk over a socket',
      cols: 2,
      children: [
        {
          id: 'ex-a',
          label: 'Executor A',
          pattern: 'service',
          sub: 'one machine, two processes',
          cols: 2,
          children: [
            { id: 'a-jvm', label: 'the JVM', pattern: 'network', sub: 'the engine · your data lives here' },
            { id: 'a-py', label: 'a Python process', pattern: 'warn', sub: 'idle until you need it' },
          ],
        },
        {
          id: 'ex-b',
          label: 'Executor B',
          pattern: 'service',
          sub: 'same arrangement, every node',
          cols: 2,
          children: [
            { id: 'b-jvm', label: 'the JVM', pattern: 'network', sub: 'the engine · your data lives here' },
            { id: 'b-py', label: 'a Python process', pattern: 'warn', sub: 'idle until you need it' },
          ],
        },
      ],
    },
    {
      id: 'claim',
      label: 'Your rows are in the JVM',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'every question in this course is: does a row have to leave it?',
    },
  ],
  edges: [{ source: 'cluster', target: 'claim' }],
}
