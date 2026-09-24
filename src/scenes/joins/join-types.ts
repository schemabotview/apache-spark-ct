import type { Scene } from '@graphlearning/flow'

// §8 — join types, as a table, because the content is a comparison down a fixed set of columns and
// the useful half is the rightmost one: what the type does to the PLAN, not what it does to rows.
export const joinTypes: Scene = {
  id: 'joins-types',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'types',
      kind: 'table',
      pattern: 'service',
      label: 'What the join type costs, beyond what it returns',
      sub: 'the rows it keeps are the part you already know — this is the part that shows up in the plan',
      headers: ['Type', 'Keeps', 'What it does to the plan'],
      values: [
        ['inner', 'matched pairs only', 'the cheapest — the filter can be pushed to both sides'],
        ['left outer', 'all of the left', 'the left side can no longer be filtered by the match'],
        ['full outer', 'all of both', 'rules out broadcast in most cases — both sides must shuffle'],
        ['left semi', 'left rows that match', 'no right columns, so it stops at the first match'],
        ['left anti', 'left rows with no match', 'must scan the whole right side to prove a negative'],
        ['cross', 'every pair', 'no keys, so no partitioning to exploit — see §6'],
      ],
    },
    {
      id: 'note',
      label: 'The underused two',
      pattern: 'network',
      icon: 'lightbulb',
      sub: 'an EXISTS written as an inner join duplicates rows',
    },
  ],
  edges: [{ source: 'types', target: 'note' }],
}
