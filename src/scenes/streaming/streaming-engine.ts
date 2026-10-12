import type { Scene } from '@graphlearning/flow'

// §7.2 — one micro-batch: plan the new offsets, write them ahead to the checkpoint, run the
// incremental plan against the state store, write the sink, then commit. Beside it, the progress
// report fields the engine publishes per batch.
export const streamingEngine: Scene = {
  id: 'streaming-engine',
  title: 'The micro-batch engine',
  flow: 'TB',
  nodes: [
    {
      id: 'microbatch-steps',
      label: 'One micro-batch',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'plan-offsets', label: 'Plan offsets', sub: 'what is new since last batch', pattern: 'service', icon: 'search' },
        { id: 'wal-write', label: 'Write-ahead', sub: 'offsets saved first', pattern: 'storage', icon: 'scroll' },
        { id: 'run-batch', label: 'Run the plan', sub: 'on new rows only', pattern: 'service', icon: 'cpu' },
        { id: 'state-update', label: 'Update state', sub: 'running totals', pattern: 'storage', icon: 'database' },
        { id: 'sink-write', label: 'Write sink', sub: 'per output mode', pattern: 'network', icon: 'table' },
        { id: 'commit-batch', label: 'Commit', sub: 'batch marked done', pattern: 'service', icon: 'circlecheck' },
      ],
    },
    {
      id: 'progress-json',
      kind: 'code',
      filename: 'query.lastProgress (abridged)',
      label: `{"batchId": 2,
 "numInputRows": 3,
 "durationMs": {"walCommit": …,
                "addBatch": …},
 "eventTime": {"max": "09:17",
               "watermark": "08:58"},
 "stateOperators": [{"numRowsTotal": 2}],
 "sources": [{"endOffset":
                {"logOffset": 1}}]}`,
    },
  ],
  edges: [],
}
