import type { Section } from '../types'

export const streamingJoins: Section = {
  id: 'streaming-joins',
  title: 'Stream-static and stream-stream joins',
  scene: 'streaming-joins',
  focus: 'join-results',
  slide: `## Stream-static and stream-stream joins

**Objective:** know what each kind of streaming join must remember, and what bounds it.

### Stream-static: orders to stores
No join state; each batch's rows join the table — the resent o2 was **joined twice**.

### Stream-stream: orders to payments
- Both sides wait in state for a match
- Watermarks plus a **time bound** let old rows go — optional for inner, **required** for outer

### Worked: pay within 15 minutes
- o1 and o4 paid in 2 min → **joined** at batches 0 and 2
- o2 paid in 16 min, o3 in 32 → **never joined**
- State reached **11 rows**

### The misconception
"A streaming join waits until both sides arrive." Only as long as the **bound** allows.`,
  narration:
    "Joins in a stream come in two kinds. A stream static join joins each micro-batch to a table that does not stream, here the order events to the stores table. Every batch's new rows are joined to the stores, and no join state is needed. But it joins what arrives, duplicates included: the resent copy of order two was joined to Leeds twice. Deduplicate first if that matters. A stream to stream join is harder, because either side can arrive first. Here orders join to payments. Spark must keep orders in state until their payment arrives, and payments until their order arrives. Without a limit, that state grows forever. So we declare a watermark on each side and a time bound in the join condition: the payment must come within fifteen minutes of the order. Together they tell Spark when a row can no longer match and can be removed. For inner joins these are optional but strongly advised. For outer joins they are required, because Spark can only emit the unmatched row once it knows no match is coming. Now the result. Order one was paid two minutes later and joined in batch zero. Order four, also two minutes, joined in batch two. Order two was paid sixteen minutes later and order three thirty two minutes later. Both fall outside the bound, so they never joined. Along the way the join held up to eleven rows of state. The misconception to drop is that a streaming join waits until both sides arrive. It waits only as long as the bound allows.",
}
