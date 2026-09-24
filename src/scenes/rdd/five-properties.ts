import type { Scene } from '@graphlearning/flow'

export const fiveProperties: Scene = {
  id: 'rdd-five-properties',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'required',
      label: 'The three every RDD must have',
      pattern: 'group',
      sub: 'this is the whole interface — an RDD is a description of how to produce data, not the data',
      cols: 3,
      children: [
        { id: 'p-parts', label: 'a list of partitions', pattern: 'storage', sub: 'the pieces it splits into' },
        { id: 'p-compute', label: 'a compute function', pattern: 'service', sub: 'how to produce one partition' },
        { id: 'p-deps', label: 'its dependencies', pattern: 'network', sub: 'which parents it was built from' },
      ],
    },
    {
      id: 'optional',
      label: 'And two that are optional',
      pattern: 'group',
      sub: 'both are hints to the scheduler — they change how the work is placed, never what it computes',
      cols: 2,
      children: [
        { id: 'p-partitioner', label: 'a partitioner', pattern: 'network', sub: 'how keys map to partitions, if keyed' },
        { id: 'p-locality', label: 'preferred locations', pattern: 'network', sub: 'where each partition would rather run' },
      ],
    },
    {
      id: 'claim',
      label: 'That is the whole of it',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'every famous Spark behaviour falls out of one of these five',
    },
  ],
  edges: [
    { source: 'required', target: 'optional' },
    { source: 'optional', target: 'claim' },
  ],
}
