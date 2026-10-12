import type { Scene } from '@graphlearning/flow'

// §7.10 — a stream-static join (orders to the stores table) and a stream-stream join (orders to
// payments within 15 minutes), with the matches 4.0.1 produced on the chapter's events.
export const streamingJoins: Scene = {
  id: 'streaming-joins',
  title: 'Stream-static and stream-stream joins',
  flow: 'TB',
  nodes: [
    {
      id: 'join-code',
      kind: 'code',
      filename: 'joins.py',
      label: `# stream-static: no watermark needed
events.join(stores, "store_id", "left")

o = events.withWatermark("event_time", "10 minutes")
p = payments.withWatermark("paid_at", "10 minutes")
o.join(p, F.expr("""pay_order = order_id AND
    paid_at BETWEEN event_time
                AND event_time + interval 15 minutes"""))`,
    },
    {
      id: 'join-results',
      kind: 'table',
      label: 'Orders and their payments',
      sub: 'inner join, 15-minute bound',
      headers: ['order', 'ordered', 'paid', 'joined?'],
      values: [
        ['o1', '09:01', '09:03', 'yes, batch 0'],
        ['o4', '09:14', '09:16', 'yes, batch 2'],
        ['o2', '09:04', '09:20', 'no — 16 min'],
        ['o3', '09:08', '09:40', 'no — 32 min'],
      ],
    },
  ],
  edges: [{ source: 'join-code', target: 'join-results' }],
}
