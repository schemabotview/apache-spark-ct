import type { Section } from '../types'

export const realTimeView: Section = {
  id: 'real-time-view',
  title: 'Speed layer · Write the real-time view',
  scene: 'cap-real-time-view',
  slide: `## Speed · Write the real-time view

Write the windowed aggregates out continuously, with a **checkpoint** — giving **exactly-once**, seconds-fresh results.

### What’s happening
- \`update\` mode emits only the windows that **changed** this trigger — efficient for running aggregates
- \`checkpointLocation\` persists **offsets + state** → exactly-once, resume after a crash
- Downstream reads \`revenue_rt\` for the **latest** slice — seconds fresh, not hours

**Exercises:** output modes · sinks · checkpoint / exactly-once`,
  narration:
    'The last speed stage writes the result out, and it ties together everything about fault tolerance. We call writeStream and choose update output mode, so on each trigger Spark emits only the windows whose totals actually changed — the natural, efficient choice for a running aggregate. We point it at a checkpoint location, and that single option is what makes the whole streaming job trustworthy: on every trigger Spark durably records both the Kafka offsets it has consumed and the current window state, so if the job crashes it resumes from exactly where it left off, losing nothing and double-counting nothing — end-to-end exactly-once. And it writes into a table, revenue_rt, that downstream consumers can read to get the very latest slice of revenue — seconds old, not hours. Update is just one of three output modes, incidentally: append emits only rows that are final and will never change, complete rewrites the entire result table every trigger, and update, which we chose, emits just what changed. And the sink is every bit as flexible — instead of a table we could write the stream out to Kafka, to files, to the console while debugging, or use foreachBatch to push each micro-batch into absolutely any system. Notice the checkpoint below the write stage lighting up: that’s the durability foundation the whole streaming job stands on. And with that, the speed layer is complete. Step back and look at what we have: on the left, a batch view that’s perfectly accurate but stale; on the right, a real-time view that’s fresh but only covers the recent window and can miss corrections. Neither alone answers our question well. The serving layer’s job is to combine them — and that’s where we go next.',
}
