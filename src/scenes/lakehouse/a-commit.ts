import type { Scene } from '@graphlearning/flow'

export const aCommit: Scene = {
  id: 'lake-commit',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'steps',
      label: 'Writing, in two phases',
      pattern: 'group',
      sub: 'the files can be written slowly and carelessly, because until the last step they are not part of anything',
      cols: 1,
      children: [
        { id: 's-1', label: '1 · write the files', pattern: 'network', sub: 'minutes · invisible to every reader' },
        { id: 's-2', label: '2 · append ONE log entry', pattern: 'service', sub: 'and the whole write becomes visible at once' },
      ],
    },
    {
      id: 'atomic',
      label: 'Which makes step 2 the atomic moment',
      pattern: 'group',
      sub: 'whether it succeeds comes down to one thing: can two writers both create 003.json?',
      cols: 2,
      children: [
        { id: 'a-win', label: 'one writer wins', pattern: 'service', sub: 'the entry exists · the write is committed' },
        { id: 'a-lose', label: 'the other retries', pattern: 'network', sub: 'against the new version — optimistic concurrency' },
      ],
    },
    {
      id: 'crash',
      label: 'A crash is now dull',
      pattern: 'service',
      icon: 'shield',
      sub: 'no entry written → the orphan files are not in the table',
    },
  ],
  edges: [
    { source: 'steps', target: 'atomic' },
    { source: 'atomic', target: 'crash' },
  ],
}
