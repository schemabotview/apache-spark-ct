import type { Scene } from '@graphlearning/flow'

// §7.7 — the same windowed query in append mode: a window is emitted once, only after the watermark
// passes its end, and from then on its state is gone. Real micro-batch output from 4.0.1, including
// the no-data batches availableNow runs to advance the watermark.
export const watermarkAppend: Scene = {
  id: 'watermark-append',
  title: 'Watermarks decide when a window is final',
  flow: 'TB',
  nodes: [
    {
      id: 'watermark-rule',
      kind: 'code',
      filename: 'the rule',
      label: `watermark = max(event_time seen) − 10 minutes
# after o3 @09:08  → 08:58
# after o5 @09:17  → 09:07
# after o6 @09:23  → 09:13
# after o8 @09:31  → 09:21
# a window is final once watermark ≥ its end`,
    },
    {
      id: 'append-emits',
      kind: 'table',
      label: 'Append mode: what reached the sink',
      sub: 'batches 1, 3, 5, 7 had no data',
      headers: ['batch', 'watermark', 'emitted', 'state rows'],
      values: [
        ['0–4', '→ 09:07', 'nothing', '1 → 3'],
        ['5', '09:13', '09:00 window: 135 (5)', '2'],
        ['6', '09:13', 'nothing; o9 dropped', '3'],
        ['7', '09:21', '09:10 window: 140 (2)', '2'],
      ],
    },
  ],
  edges: [],
}
