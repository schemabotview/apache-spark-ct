import type { Scene } from '@graphlearning/flow'

export const theListingProblem: Scene = {
  id: 'lake-listing',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'assume',
      label: 'A directory listing feels free, and on object storage it is not',
      pattern: 'group',
      sub: 'S3 has no directories at all — the slashes in a key are a convention, and a "listing" is a paged API scan',
      cols: 2,
      children: [
        { id: 'a-fs', label: 'a filesystem', pattern: 'service', sub: 'a directory is a real structure' },
        { id: 'a-obj', label: 'object storage', pattern: 'warn', sub: 'a flat keyspace · prefix scans' },
      ],
    },
    {
      id: 'cost',
      label: 'So finding out what a table contains is itself expensive',
      pattern: 'group',
      sub: 'and it happens on the driver, single-threaded, before a single executor is given anything to do',
      cols: 3,
      children: [
        { id: 'c-api', label: '1000 keys per call', pattern: 'warn', sub: 'a million files = 1000 round trips' },
        { id: 'c-driver', label: 'on the driver', pattern: 'warn', sub: 'the cluster sits idle, paid for' },
        { id: 'c-part', label: 'and then per partition', pattern: 'warn', sub: 'directory discovery, on top' },
      ],
    },
    {
      id: 'idea',
      label: 'Which suggests the fix',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'stop asking storage what the table contains. Write it down.',
    },
  ],
  edges: [
    { source: 'assume', target: 'cost' },
    { source: 'cost', target: 'idea' },
  ],
}
