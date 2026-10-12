import type { Scene } from '@graphlearning/flow'

// §7.11 — what a checkpoint directory holds, what a restart from it does, and which query changes
// the 4.0.1 guide allows between restarts.
export const checkpointRestart: Scene = {
  id: 'checkpoint-restart',
  title: 'Checkpoints and restarts',
  flow: 'TB',
  nodes: [
    {
      id: 'checkpoint-tree',
      kind: 'code',
      filename: 'ck/  after two batches',
      label: `offsets/0  offsets/1   # planned, written first
commits/0  commits/1   # finished
sources/               # file source log
state/                 # store totals
metadata               # query id
# offsets/1 → {"logOffset":1}
# restart: next run is batch 2, reads 2 new rows`,
    },
    {
      id: 'change-table',
      kind: 'table',
      label: 'Changes between restarts',
      sub: 'same checkpoint location',
      headers: ['change', 'allowed?'],
      values: [
        ['add or remove a filter', 'yes'],
        ['add a source, change its type', 'no'],
        ['new file-sink output path', 'no'],
        ['new grouping keys or aggregates', 'no — state schema'],
      ],
    },
  ],
  edges: [],
}
