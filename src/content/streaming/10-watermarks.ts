import type { Section } from '../types'

export const watermarks: Section = {
  id: 'watermarks',
  title: 'Watermarks: the promise that lets state be dropped',
  scene: 'str-watermarks',
  focus: 'trade',
  slide: `## Watermarks

**When can a window be closed and its state dropped?**

Never — without a rule. A row for 09:00 might still turn up tomorrow, so in principle every window must stay open forever.

### A watermark is a promise you make about lateness
\`\`\`python
df.withWatermark("event_ts", "10 minutes")
\`\`\`
*"Nothing more than 10 minutes late matters to me."*

Spark subtracts that threshold from the **latest event time it has seen**, and drops state for windows the result has passed.

### And it forces a trade you have to make explicitly
| | |
|---|---|
| **Too short** | late rows **silently dropped** |
| **Too long** | state grows, latency grows |

There's no setting that gives both. The honest answer is a number chosen by measuring **how late your data actually is** — not a default copied from a tutorial.

> It advances on the *data*, not the clock. If the stream goes quiet, the watermark stops moving and windows stay open.`,
  narration:
    "Watermarks are the part of streaming people find hardest, and I think it's because they're usually introduced as a setting rather than as an answer to a question. So here's the question. When can a window be closed and its state thrown away? And the honest answer, without further information, is never. A row with an event time of nine o'clock this morning might turn up tomorrow — from a phone that was offline, from a broker that was backed up. So in principle every window must stay open forever, and your state grows without bound until the job dies. A watermark is how you make that answerable. You declare: nothing more than ten minutes late matters to me. That's a promise about your data, and it's yours to make, because only you know what your sources do. Spark takes the latest event time it has seen, subtracts your threshold, and that's the watermark. Any window that ended before the watermark is finished — no more rows for it will be accepted — so its state can be dropped and its result emitted. Now the trade, and this is the part to make explicitly rather than by default. Too short a watermark and genuinely late rows are silently discarded; your counts are quietly wrong and nothing tells you. Too long and state grows, memory grows, and in append mode your latency grows too, because results can't be emitted until the window closes. There is no setting that gives you both, and choosing ten minutes because a tutorial said ten minutes is not choosing. Measure how late your data actually is. One subtlety worth knowing: the watermark advances on the data, not on the wall clock. If your stream goes quiet, the watermark stops moving and nothing closes.",
}
