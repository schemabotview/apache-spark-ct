import type { Scene } from '@graphlearning/flow'

// §7.5 — the chapter's ten order events grouped into 10-minute windows twice: by when they happened
// (event_time) and by when they arrived (received_at). Same rows, different answers.
export const eventVsArrival: Scene = {
  id: 'event-vs-arrival',
  title: 'Event time versus arrival time',
  flow: 'TB',
  nodes: [
    {
      id: 'late-examples',
      kind: 'table',
      label: 'Three events that arrived late',
      sub: 'event_time → received_at',
      headers: ['order', 'happened', 'arrived', 'delay'],
      values: [
        ['o2 (resent)', '09:04', '09:19', '15 min'],
        ['o7', '09:06', '09:25', '19 min'],
        ['o9', '09:02', '09:33', '31 min'],
      ],
    },
    {
      id: 'window-compare',
      kind: 'table',
      label: '10-minute windows, ten events',
      sub: 'count per window',
      headers: ['window', 'by event_time', 'by received_at'],
      values: [
        ['09:00–09:10', '6', '2'],
        ['09:10–09:20', '2', '4'],
        ['09:20–09:30', '1', '2'],
        ['09:30–09:40', '1', '2'],
      ],
    },
  ],
  edges: [],
}
