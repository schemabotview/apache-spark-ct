import type { Scene } from '@graphlearning/flow'

export const predicatePushdown: Scene = {
  id: 'cat-pushdown',
  padding: 0.12,
  flow: 'LR',
  nodes: [
    {
      id: 'before',
      label: 'Before — the filter is above the join',
      pattern: 'group',
      sub: 'as written: join everything, then discard. Read bottom-up.',
      children: [
        { id: 'p-f', label: 'Filter (country#7 = IN)', pattern: 'warn', sub: 'runs on the JOINED rows' },
        { id: 'p-j', label: 'Join (user#3 = user#9)', pattern: 'service', sub: 'all 4B rows × all users' },
        { id: 'p-r1', label: 'Relation flights', pattern: 'storage', sub: '4B rows' },
      ],
      edges: [
        { source: 'p-r1', target: 'p-j' },
        { source: 'p-j', target: 'p-f' },
      ],
    },
    {
      id: 'after',
      label: 'After — PushDownPredicate fired',
      pattern: 'group',
      sub: 'the filter moved BELOW the join and INTO the scan, so the rows never reach the join at all',
      children: [
        { id: 'q-j', label: 'Join (user#3 = user#9)', pattern: 'service', sub: 'now joins 40M rows, not 4B' },
        { id: 'q-r1', label: 'Relation flights', pattern: 'service', sub: 'PushedFilters: [country = IN]' },
      ],
      edges: [{ source: 'q-r1', target: 'q-j' }],
    },
    {
      id: 'legal',
      label: 'Why it is allowed',
      pattern: 'service',
      icon: 'check',
      sub: 'on an INNER join the answer is provably identical',
    },
  ],
  edges: [
    { source: 'before', target: 'after', label: 'PushDownPredicate' },
    { source: 'after', target: 'legal' },
  ],
}
