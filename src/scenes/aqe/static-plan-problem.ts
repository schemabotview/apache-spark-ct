import type { Scene } from '@graphlearning/flow'

export const staticPlanProblem: Scene = {
  id: 'aqe-static-problem',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'when',
      label: 'The optimizer decides before it has seen anything',
      pattern: 'group',
      sub: 'every choice about how to run the query is made at plan time, from numbers nobody measured',
      cols: 3,
      children: [
        { id: 'w-size', label: 'how big is that table?', pattern: 'warn', sub: 'from stats, if they exist' },
        { id: 'w-filter', label: 'how many rows survive?', pattern: 'warn', sub: 'a heuristic fraction' },
        { id: 'w-skew', label: 'are the keys even?', pattern: 'warn', sub: 'assumed, always' },
      ],
    },
    {
      id: 'consequence',
      label: 'Wrong, deterministically',
      pattern: 'warn',
      icon: 'repeat',
      sub: 'the same wrong plan, every run, until the stats change',
    },
    {
      id: 'idea',
      label: 'But they exist — later',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'partway through, Spark knows exactly what it has',
    },
  ],
  edges: [
    { source: 'when', target: 'consequence' },
    { source: 'consequence', target: 'idea' },
  ],
}
