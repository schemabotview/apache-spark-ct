import type { Section } from '../types'

export const stateGrowth: Section = {
  id: 'state-growth',
  title: 'Stateful operations and state growth',
  scene: 'state-growth',
  focus: 'state-table',
  slide: `## State, and what bounds it

**Objective:** see which operations keep state, and why only a watermark lets Spark forget.

### Stateful operations
Aggregations, \`dropDuplicates\` and stream-stream joins keep state per partition, saved with each checkpoint.

### Worked: removing the resent o2
- \`dropDuplicates(["order_id"])\` keeps **every id forever**: 3, 5, 7, 9 rows
- \`dropDuplicatesWithinWatermark\` keeps ids only while their event time is in the watermark: 3, 5, 5, 4 rows
- Both removed the second o2
- With the watermark, **o7 and o9 were dropped too** — their event time was already behind it

### The misconception
"The stream is small, so state is small." State grows with **distinct keys over all time**, not with batch size. At ~200 GB of events a day, unbounded dedup state grows without limit.`,
  narration:
    "Some streaming operations need to remember the past. Aggregations keep running totals, deduplication keeps the ids it has already seen, and stream to stream joins keep rows waiting for a match. That memory is called state. It lives per partition in a state store on the executors, and it is saved with every checkpoint. The question to ask of any stateful query is: what lets Spark forget? Here we remove the resent copy of order two, in two ways. Drop duplicates on order id, with no watermark, has to remember every id it has ever seen, because a duplicate could arrive at any time. The state goes three, five, seven, nine, growing with every order. Drop duplicates within watermark keeps an id only while its event time is within the watermark, so old ids are removed. Its state goes three, five, five, four. Both versions removed the second order two. But notice what else changed. With the watermark, orders seven and nine were dropped as well, because their event times were already behind the watermark when they arrived. The window aggregation in the last section, with its own state, still accepted order seven. So the watermark bounds state, and it also decides which late events count. The misconception to drop is that a small stream has small state. State grows with the number of distinct keys over the whole life of the query, not with the size of each batch. At two hundred gigabytes of order events a day, deduplication without a watermark grows without limit, until the executors run out of memory.",
}
