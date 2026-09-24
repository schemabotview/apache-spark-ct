import type { Scene } from '@graphlearning/flow'

export const compaction: Scene = {
  id: 'lake-compaction',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'cause',
      label: 'The small-file problem, now arriving faster',
      pattern: 'group',
      sub: 'a log makes frequent writes SAFE, which means people do them — and every commit adds files',
      cols: 2,
      children: [
        { id: 'ca-stream', label: 'a streaming write', pattern: 'warn', sub: 'files every trigger, forever' },
        { id: 'ca-merge', label: 'and every MERGE', pattern: 'warn', sub: 'rewrites files into more files' },
      ],
    },
    {
      id: 'fix',
      label: 'Compaction is a normal commit with an unusual content',
      pattern: 'group',
      sub: 'read many small files, write few large ones, and record both facts in one log entry',
      cols: 3,
      children: [
        { id: 'f-read', label: 'read 1000 small', pattern: 'network', sub: 'the current file set' },
        { id: 'f-write', label: 'write 10 large', pattern: 'service', sub: 'the same rows' },
        { id: 'f-commit', label: 'one entry: add + remove', pattern: 'service', sub: 'atomic, as ever' },
      ],
    },
    {
      id: 'safe',
      label: 'And readers are undisturbed',
      pattern: 'service',
      icon: 'shield',
      sub: 'a running query keeps its version — nothing is deleted yet',
    },
  ],
  edges: [
    { source: 'cause', target: 'fix' },
    { source: 'fix', target: 'safe' },
  ],
}
