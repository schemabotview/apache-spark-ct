import type { Scene } from '@graphlearning/flow'

export const nothingHappensYet: Scene = {
  id: 'exec-nothing-yet',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'wrote',
      label: 'What you wrote',
      pattern: 'group',
      sub: 'four lines that look like they read a file and compute an answer',
      cols: 1,
      children: [
        { id: 'w1', label: 'spark.read.parquet(…)', pattern: 'storage', sub: 'no file is opened' },
        { id: 'w2', label: '.filter(…)', pattern: 'service', sub: 'no row is tested' },
        { id: 'w3', label: '.groupBy(…).count()', pattern: 'service', sub: 'nothing is counted' },
      ],
    },
    {
      id: 'happened',
      label: 'What actually happened',
      pattern: 'group',
      sub: 'a plan was built on the driver, in memory, and nothing was sent anywhere',
      cols: 2,
      children: [
        { id: 'h-plan', label: 'a tree grew', pattern: 'network', sub: 'each call adds a node' },
        { id: 'h-cluster', label: 'the cluster is idle', pattern: 'network', sub: 'it has not been told anything' },
      ],
    },
    {
      id: 'why',
      label: 'Why wait',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'you cannot optimise a chain you cannot yet see the end of',
    },
  ],
  edges: [
    { source: 'wrote', target: 'happened' },
    { source: 'happened', target: 'why' },
  ],
}
