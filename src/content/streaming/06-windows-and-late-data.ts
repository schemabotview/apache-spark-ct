import type { Section } from '../types'

export const windowsAndLateData: Section = {
  id: 'windows-and-late-data',
  title: 'Event-time windows and late data',
  scene: 'window-timeline',
  focus: 'window-batches',
  slide: `## A window and its late data

**Objective:** follow one event-time window through four micro-batches, including two late events.

### The query
10-minute tumbling windows by event time, 10-minute watermark, **update** mode.

### Worked: window 09:00–09:10
- Batch 0: o1, o2, o3 → **80** (3 orders)
- Batch 1: o2 resent → **105** (4) — no dedup yet, so counted twice
- Batch 2: o7 from 09:06 arrives 19 min late; watermark 09:07 is before the window ends → **kept, 135**
- Batch 3: o9 from 09:02; watermark 09:13 is past the window → **dropped** (\`numRowsDroppedByWatermark\` 1)

### The misconception
"Late data is either always kept or always lost." It depends on the **watermark** at the time it arrives, not how late it is.`,
  narration:
    "Now we follow one event time window through four micro-batches. The query groups the orders into ten minute tumbling windows by event time, sums the amount and counts the orders. It declares a watermark of ten minutes, and it runs in update mode, which sends a window to the sink every time its value changes. Watch the window from nine o'clock to ten past. In batch zero, orders one, two and three arrive, and the window holds eighty, from three orders. In batch one, a resent copy of order two arrives. Nothing removes duplicates yet, so it is counted again: one hundred and five, from four orders. We fix that in section eight. In batch two, order seven arrives. It happened at six minutes past nine, but arrived nineteen minutes late. The watermark in force is seven minutes past nine, which is still before the window's end, so the window is open and order seven is added: one hundred and thirty five. In batch three, order nine arrives, from two minutes past nine. By now the watermark is thirteen minutes past nine, beyond the window's end. The window is closed, its state has been removed, and order nine is dropped. The progress report counts it: rows dropped by watermark, one. Notice the misconception this exposes. Order nine was thirty one minutes late, order seven nineteen. Whether a late event is kept depends on the watermark when it arrives, not on how late it is in isolation. The next section explains how that watermark moves.",
}
