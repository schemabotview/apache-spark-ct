import type { Scene } from '@graphlearning/flow'

// §6 — nested loop. Short scene: the shape of the cost is the whole content.
export const nestedLoop: Scene = {
  id: 'joins-nested-loop',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'cause',
      label: 'What forces it',
      pattern: 'group',
      sub: 'every other strategy needs an equality to hash on — take that away and only this is left',
      cols: 3,
      children: [
        { id: 'c-range', label: 'a range condition', pattern: 'warn', sub: 'ON a.ts BETWEEN b.start AND b.end' },
        { id: 'c-ineq', label: 'an inequality', pattern: 'warn', sub: 'ON a.price > b.floor' },
        { id: 'c-none', label: 'no condition at all', pattern: 'warn', sub: 'a cross join, written by accident' },
      ],
    },
    {
      id: 'cost',
      label: 'Every row × every row',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: '1M × 1M = 1,000,000,000,000 comparisons',
    },
    {
      id: 'live',
      label: 'When you have to live with it',
      pattern: 'group',
      sub: 'the condition is genuinely non-equi — so make the inner side small instead of making it go away',
      cols: 2,
      children: [
        { id: 'l-bnlj', label: 'broadcast the small side', pattern: 'service', sub: 'O(n×m) but with zero shuffle' },
        { id: 'l-prefilter', label: 'add an equi-key', pattern: 'service', sub: 'join on the day, then filter the range' },
      ],
    },
  ],
  edges: [
    { source: 'cause', target: 'cost' },
    { source: 'cost', target: 'live' },
  ],
}
