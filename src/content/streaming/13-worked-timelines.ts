import type { Section } from '../types'

export const workedTimelines: Section = {
  id: 'worked-timelines',
  title: 'Worked timelines: late events, duplicates, state retention, and recovery',
  scene: 'recovery-timeline',
  focus: 'event-fates',
  slide: `## The worked timeline

**Assumptions:** file source, 10-minute watermark, \`dropDuplicatesWithinWatermark\` → 10-minute windows → append to a file sink, \`availableNow\`.

### Tracing every event
- o1, o2, o3 → window 09:00; o4, o5 → window 09:10
- The resent **o2** → removed as a duplicate
- **o7** (09:06, arrived 09:25) and **o9** (09:02, arrived 09:33) → dropped, behind the watermark
- o6, o8 → windows 09:20 and 09:30, still open

### In the sink after file 4
- Watermark **09:21**: window 09:00 **80** (3 orders), window 09:10 **140** (2)

### Recovery
A crash at any point replays the uncommitted batch from the checkpoint; the file sink keeps each window **once**.

### Limitations
o7 was a real sale and is missing. A longer delay keeps it, at the cost of later output and more state.`,
  narration:
    "Let's put the whole chapter into one timeline, and state the assumptions first. The source is files, so it can replay. The query declares a ten minute watermark, removes duplicates within the watermark, groups into ten minute windows, and appends to a file sink, running with the available now trigger. Now trace every event. Orders one, two and three fall in the nine o'clock window. Orders four and five fall in the ten past window. The resent copy of order two arrives in file two and is removed as a duplicate, because its id is still in state. Order seven happened at six past nine but arrived at twenty five past, when the watermark was already seven past, so it is dropped. Order nine, from two past nine, arrives even later and is dropped too. Orders six and eight start the twenty past and half past windows, which stay open. After file four, the watermark is twenty one minutes past nine. The sink holds two final rows: the nine o'clock window, eighty from three orders, and the ten past window, one hundred and forty from two orders. Now add a crash anywhere in this timeline. Spark replays the uncommitted batch from the checkpoint, the file sink keeps each window once, and the final output is the same. Finally, the limitation. Order seven was a real sale, and it is missing from these totals. A longer watermark would keep it, at the cost of later output and more state. Streaming adds state that must be bounded, recovery that must be designed, and outputs that run for months. Next, we connect those obligations to running Spark in production.",
}
