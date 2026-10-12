import type { Section } from '../types'

export const watermarks: Section = {
  id: 'watermarks',
  title: 'Watermarks and their consequences',
  scene: 'watermark-append',
  focus: 'append-emits',
  slide: `## Watermarks decide when a window is final

**Model:** watermark = the latest event time seen, minus the delay you declare. It only moves forward.

### Worked: append mode, same events
- Watermark after each file: **08:58 → 09:07 → 09:13 → 09:21**
- Window 09:00 emitted once, at batch 5, when the watermark reached 09:13: **135 (5 orders)**
- Window 09:10 emitted at batch 7: **140 (2 orders)**
- Batches 1, 3, 5, 7 had **no data** — they ran only to advance the watermark
- State rows stayed between **1 and 3**

### The guarantee, one way only
- Data within the delay is **never** dropped
- Data later than the delay **may** still be counted — not guaranteed either way

### The trade
Longer delay: more late data kept, but later output and more state.`,
  narration:
    "A watermark is how Spark decides that a window is final. Its value is the latest event time seen so far, minus the delay you declare, here ten minutes. It is updated between batches and it never moves backwards. In our events, after order three at eight minutes past nine, the watermark becomes two minutes to nine. After order five, seven past nine. After order six, thirteen past. After order eight, twenty one past. Now run the same windowed query in append mode, which writes each window exactly once, only when it can no longer change. Nothing reaches the sink at first. At batch five the watermark reaches thirteen past nine, past the end of the nine o'clock window, so that window is written: one hundred and thirty five, from five orders. At batch seven, the ten past window is written: one hundred and forty, from two orders. Batches one, three, five and seven had no new data at all. Available now ran them only to move the watermark forward so windows could close. And because closed windows leave state, the state never held more than three rows. Read the guarantee carefully, because it holds in one direction only. Data that arrives within the declared delay is never dropped. Data later than that may be dropped, but is not guaranteed to be; it depends on batch timing. So the delay is a trade. A longer delay keeps more late events, but every window is written later and more state is kept in memory. A shorter delay gives fresher results and less state, and loses more late data.",
}
