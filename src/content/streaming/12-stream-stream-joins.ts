import type { Section } from '../types'

export const streamStreamJoins: Section = {
  id: 'stream-stream-joins',
  title: 'Stream-stream joins',
  scene: 'str-stream-joins',
  focus: 'need',
  slide: `## Stream-stream joins

Neither side is finished, so **neither can be the build side.** A row on the left may match one on the right that hasn't arrived yet.

### So both sides are buffered in state
Every unmatched row is kept in case its partner turns up. Without a bound, that's **every row, forever.**

### Which is why Spark demands two things
| | |
|---|---|
| **A watermark on *both* sides** | how late each may be |
| **A time bound in the \`ON\`** | *clicks within an hour of the impression* |

Together they cap how long a row can usefully be kept — and therefore the state.

> Outer joins need more: a null result can only be emitted once Spark is sure no match will arrive, so the watermark also decides when a **non-match** is final.`,
  narration:
    "Stream-stream joins are the most demanding thing in Structured Streaming, and understanding why makes the constraints feel reasonable rather than arbitrary. Recall how a batch join works: one side is the build side, held in memory, and the other is streamed past it. That requires one side to be finished, so you know you've got all of it. In a stream-stream join, neither side is finished. Ever. A row arriving on the left might match a row on the right that hasn't been produced yet. So neither can be the build side, and you can't simply discard a row because it didn't match — its partner might be five minutes away. So Spark buffers both sides in state. Every unmatched row is kept, in case its partner turns up. And without a bound on that, you're keeping every row from both streams, forever, which fails quickly. Which is why Spark refuses to run one unless you give it two things. First, a watermark on both sides, declaring how late each stream may be. Second, a time bound inside the join condition itself — not just that the ad ids match, but that the click happened within an hour of the impression. Together those put a ceiling on how long any row could usefully be kept: once the watermark has moved past the latest time a match could occur, that buffered row can be dropped. State stays bounded. One extra wrinkle for outer joins. An outer join has to emit a null result for a row that never matched — but Spark can only do that once it's certain no match will ever arrive. So the watermark is doing double duty: it decides when state can be dropped, and it decides when a non-match becomes final. Which means your unmatched rows arrive late, by design, by exactly the watermark delay.",
}
