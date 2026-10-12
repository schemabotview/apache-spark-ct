import type { Scene } from '@graphlearning/flow'

// §7.8 — state rows per micro-batch for deduplication with and without a watermark, from 4.0.1's
// stateOperators.numRowsTotal. Without a watermark the state keeps every order id forever.
export const stateGrowth: Scene = {
  id: 'state-growth',
  title: 'State, and what bounds it',
  flow: 'TB',
  nodes: [
    {
      id: 'dedup-code',
      kind: 'code',
      filename: 'dedup.py',
      label: `events.dropDuplicates(["order_id"])
# state: every order id, forever

(events.withWatermark("event_time", "10 minutes")
       .dropDuplicatesWithinWatermark(["order_id"]))
# state: only ids inside the watermark`,
    },
    {
      id: 'state-table',
      kind: 'table',
      label: 'State rows after each data batch',
      sub: 'numRowsTotal once each file is processed',
      headers: ['after file', 'no watermark', 'with watermark'],
      values: [
        ['1', '3', '3'],
        ['2', '5', '5'],
        ['3', '7', '5'],
        ['4', '9', '4'],
        ['emitted', 'o1–o9', 'o1–o6, o8'],
      ],
    },
  ],
  edges: [{ source: 'dedup-code', target: 'state-table' }],
}
