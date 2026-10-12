import type { Scene } from '@graphlearning/flow'

// §7.6 — the 09:00–09:10 window through four micro-batches in update mode with a 10-minute
// watermark, from PySpark 4.0.1: o7 arrives late but inside the watermark and is added; o9 arrives
// after the window has closed and is dropped.
export const windowTimeline: Scene = {
  id: 'window-timeline',
  title: 'A window and its late data',
  flow: 'TB',
  nodes: [
    {
      id: 'window-code',
      kind: 'code',
      filename: 'windowed_sales.py',
      label: `(events.withWatermark("event_time", "10 minutes")
       .groupBy(F.window("event_time", "10 minutes"))
       .agg(F.sum("amount").alias("sales"),
            F.count("*").alias("orders")))`,
    },
    {
      id: 'window-batches',
      kind: 'table',
      label: 'Window 09:00–09:10, update mode',
      sub: 'watermark in force during the batch',
      headers: ['batch', 'arrives', 'watermark', 'window 09:00'],
      values: [
        ['0', 'o1 o2 o3', '—', '80 (3 orders)'],
        ['1', 'o4 o5 o2 again', '08:58', '105 (4)'],
        ['2', 'o6, o7 @09:06', '09:07', '135 (5) — o7 kept'],
        ['3', 'o8, o9 @09:02', '09:13', 'closed — o9 dropped'],
      ],
    },
  ],
  edges: [{ source: 'window-code', target: 'window-batches' }],
}
