import type { Scene } from '@graphlearning/flow'

// §7 skew — the numbers ARE the diagram. Four reduce tasks, three of them ordinary and one three
// hundred times bigger, because skew is not a subtle condition: it is one row count that does not
// belong on the same axis as the others. The cause group above explains why the partitioner is not
// at fault — hashing is uniform over KEYS, and the rows are not uniform over keys. The consequence
// band below is what the owner actually experiences: a stage that is 99.5% done for an hour.
export const skew: Scene = {
  id: 'shuffle-skew',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'cause',
      label: 'The partitioner is doing its job correctly',
      pattern: 'group',
      sub: 'hash spreads KEYS evenly — nobody promised the rows were spread evenly over the keys',
      cols: 3,
      children: [
        { id: 'k-null', label: 'user_id = NULL', pattern: 'warn', sub: '38% of rows, one key', variant: 'tile' },
        { id: 'k-guest', label: 'user_id = "guest"', pattern: 'warn', sub: 'every logged-out session', variant: 'tile' },
        { id: 'k-rest', label: '4.1M real users', pattern: 'network', sub: 'the rest of the rows', variant: 'tile' },
      ],
    },
    {
      id: 'tasks',
      label: 'Reduce tasks in the same stage',
      pattern: 'group',
      sub: 'same code, same memory, same executor class — the only difference is how many rows arrived',
      cols: 4,
      children: [
        { id: 't-5', label: 'task 5', pattern: 'service', sub: '1.2M rows · 9 s' },
        { id: 't-6', label: 'task 6', pattern: 'service', sub: '1.1M rows · 8 s' },
        { id: 't-7', label: 'task 7', pattern: 'service', sub: '1.3M rows · 11 s' },
        { id: 't-8', label: 'task 8', pattern: 'warn', sub: '412M rows · 1 h 20 m · then OOM' },
      ],
    },
    {
      id: 'result',
      label: 'What you see in the UI',
      pattern: 'group',
      sub: 'the signature of skew, and the reason more hardware is not the answer',
      cols: 3,
      children: [
        { id: 'r-green', label: '199 of 200 green', pattern: 'warn', sub: 'in about twelve seconds' },
        { id: 'r-hour', label: 'the stage: 1 h 20 m', pattern: 'warn', sub: 'waiting on one task' },
        { id: 'r-scale', label: 'adding executors', pattern: 'warn', sub: 'changes nothing at all' },
      ],
    },
  ],
  edges: [
    { source: 'cause', target: 'tasks', label: 'one key → exactly one task' },
    { source: 'tasks', target: 'result', label: 'a stage ends with its SLOWEST task' },
  ],
}
