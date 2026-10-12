import type { Section } from '../types'

export const eventVsProcessingTime: Section = {
  id: 'event-vs-processing-time',
  title: 'Event time versus processing time',
  scene: 'event-vs-arrival',
  focus: 'window-compare',
  slide: `## Event time versus arrival time

**Model:** every event has two times — when it **happened** (\`event_time\`, in the data) and when Spark **received** it.

### Worked: ten events, 10-minute windows
- Three arrived late: the resent **o2** by 15 min, **o7** by 19, **o9** by 31
- Grouped by when they happened: **6, 2, 1, 1**
- Grouped by when they arrived: **2, 4, 2, 2**
- Same rows, different answers — only one describes sales at 09:00

### Which to use
- Business questions ("sales between 09:00 and 09:10") need **event time**
- Arrival time describes the pipeline: lag, throughput
- Event time must be a column in the data, set by the producer

### The misconception
"Events arrive in order, so arrival time is close enough." Retries, offline devices and resends make **lateness normal**.`,
  narration:
    "Every event in a stream carries two different times. Event time is when the thing actually happened, the moment the customer placed the order, and it is a column in the data, written by the producer. Processing time, or arrival time, is when Spark received it. In a perfect pipeline they would be close. In practice they drift apart. Here are the chapter's ten order events. Three of them arrived late: a resent copy of order two arrived fifteen minutes after the order happened, order seven nineteen minutes late, and order nine thirty one minutes late. Now group the ten events into ten minute windows, twice. By when they happened, the counts are six, two, one and one: most of the activity was between nine and ten past nine. By when they arrived, the counts are two, four, two and two, which suggests the busiest period was ten minutes later. Same rows, different answers, and only the first one describes the business. If someone asks for sales between nine and ten past nine, they mean event time. Arrival time is still useful, but it describes the pipeline, its lag and throughput, not the shop. The misconception to drop is that events arrive roughly in order, so arrival time is close enough. Mobile devices go offline, producers retry, and upstream systems resend, as order two shows. Lateness is normal, not exceptional. So a correct streaming query groups by event time, and then needs a rule for how long to wait for late events. That is the next two sections.",
}
