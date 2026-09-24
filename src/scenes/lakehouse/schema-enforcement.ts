import type { Scene } from '@graphlearning/flow'

export const schemaEnforcement: Scene = {
  id: 'lake-schema',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'before',
      label: 'Without a log: whatever you write becomes the table',
      pattern: 'group',
      sub: 'nothing is checked, so the error surfaces weeks later, in a query, as nulls nobody can explain',
      cols: 2,
      children: [
        { id: 'b-write', label: 'a column type changes', pattern: 'warn', sub: 'and the write succeeds' },
        { id: 'b-read', label: 'nulls appear, later', pattern: 'warn', sub: 'far from the job that caused it' },
      ],
    },
    {
      id: 'after',
      label: 'With a log: the schema is IN it, and the write is checked',
      pattern: 'group',
      sub: 'the failure moves to the moment it is caused, which is the whole of what enforcement buys',
      cols: 2,
      children: [
        { id: 'a-reject', label: 'a mismatched write fails', pattern: 'service', sub: 'at write time, loudly' },
        { id: 'a-evolve', label: 'unless you allow it', pattern: 'network', sub: 'mergeSchema, deliberately' },
      ],
    },
    {
      id: 'more',
      label: 'And the log can hold more than a schema',
      pattern: 'group',
      sub: 'constraints are the thing people arrive for and the thing they did not know they could have',
      cols: 2,
      children: [
        { id: 'm-null', label: 'NOT NULL', pattern: 'service', sub: 'enforced on every write' },
        { id: 'm-check', label: 'CHECK constraints', pattern: 'service', sub: 'amount > 0, and it means it' },
      ],
    },
  ],
  edges: [
    { source: 'before', target: 'after' },
    { source: 'after', target: 'more' },
  ],
}
