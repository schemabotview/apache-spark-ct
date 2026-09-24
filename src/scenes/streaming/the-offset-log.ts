import type { Scene } from '@graphlearning/flow'

export const theOffsetLog: Scene = {
  id: 'str-offset-log',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'dir',
      label: 'The checkpoint directory',
      pattern: 'group',
      sub: 'not an optimisation — the query’s identity. Delete it and you have a different query with no memory.',
      cols: 2,
      children: [
        { id: 'd-off', label: 'offsets/', pattern: 'warn', sub: 'what this batch WILL process — written first' },
        { id: 'd-com', label: 'commits/', pattern: 'service', sub: 'what a batch DID process — written after' },
        { id: 'd-state', label: 'state/', pattern: 'network', sub: 'the running aggregates' },
        { id: 'd-meta', label: 'metadata', pattern: 'network', sub: 'the query id' },
      ],
    },
    {
      id: 'order',
      label: 'Write-ahead, and the order is the whole point',
      pattern: 'group',
      sub: 'the offset is recorded BEFORE the work, so a crash can be distinguished from a completion',
      cols: 2,
      children: [
        { id: 'o-crash', label: 'offset but no commit', pattern: 'warn', sub: 'it crashed — redo that batch' },
        { id: 'o-ok', label: 'offset and commit', pattern: 'service', sub: 'it finished — move on' },
      ],
    },
    {
      id: 'result',
      label: 'Replay, not guesswork',
      pattern: 'service',
      icon: 'rotateCcw',
      sub: 'restart reprocesses exactly the batch that was in flight',
    },
  ],
  edges: [
    { source: 'dir', target: 'order' },
    { source: 'order', target: 'result' },
  ],
}
