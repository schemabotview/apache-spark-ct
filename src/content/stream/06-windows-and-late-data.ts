import type { Section } from '../types'

export const windowsAndLateData: Section = {
  id: 'windows-and-late-data',
  title: 'Event-time windows and late data',
  scene: 'window-timeline',
  narration:
    'A window is a group of event time. Line fourteen groups the orders by window of event time, ten minutes, so each order falls into exactly one window: nine o\'clock up to ten past, ten past up to twenty past, and so on. Line fifteen sums the amounts in each. The query runs in complete mode, so every batch emits every window it knows about, and the terminal shows them. Follow the nine o\'clock window across the four batches, which the table on the right sets out. After the first file it holds eighty pounds: o one, o two and o three. After the second it holds a hundred and five, because o two was resent and counted again. After the third it holds a hundred and thirty-five: o seven, at nine oh six, arrived late but still landed in the window it belongs to. And after the fourth it holds a hundred and forty, when o nine, half an hour late, is added too. This is event time doing its job: a late order updates the window it belongs to, not the one that is current when it arrives. But look at what that costs. Because any order might still arrive late, Spark can never say that the nine o\'clock window is finished. It keeps every window open, in state, for ever, and a query that runs for months keeps months of windows. Complete mode makes it worse, re-emitting every window on every batch. The list sums it up. Windows by event time are correct, but with no limit on lateness they are never final and their state never shrinks. The engine needs to be told how late is too late, and that is the watermark.',
}
