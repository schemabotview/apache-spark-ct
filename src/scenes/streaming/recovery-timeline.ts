import type { Scene } from '@graphlearning/flow'

// §7.13 — the full timeline with deduplication within the watermark feeding the 10-minute windows
// in append mode: what each event did, and what the sink holds at the end.
export const recoveryTimeline: Scene = {
  id: 'recovery-timeline',
  title: 'The worked timeline',
  flow: 'TB',
  nodes: [
    {
      id: 'event-fates',
      kind: 'table',
      label: 'What happened to each event',
      sub: 'dedupe within watermark → window → append',
      headers: ['event', 'arrived in', 'fate'],
      values: [
        ['o1 o2 o3', 'file 1', 'window 09:00'],
        ['o4 o5', 'file 2', 'window 09:10'],
        ['o2 again', 'file 2', 'removed as duplicate'],
        ['o6', 'file 3', 'window 09:20 (open)'],
        ['o7 @09:06', 'file 3', 'dropped: before watermark'],
        ['o8', 'file 4', 'window 09:30 (open)'],
        ['o9 @09:02', 'file 4', 'dropped: before watermark'],
      ],
    },
    {
      id: 'sink-final',
      kind: 'table',
      label: 'In the sink after file 4',
      sub: 'watermark 09:21',
      headers: ['window', 'sales', 'orders'],
      values: [
        ['09:00–09:10', '80', '3'],
        ['09:10–09:20', '140', '2'],
      ],
    },
  ],
  edges: [{ source: 'event-fates', target: 'sink-final' }],
}
