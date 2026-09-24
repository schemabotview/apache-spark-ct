import type { Section } from '../types'

export const spill: Section = {
  id: 'spill',
  title: 'Spilling, and the two numbers that measure it',
  scene: 'mem-spill',
  focus: 'metrics',
  slide: `## Spilling

**Execution** memory running out — not storage. A sort or aggregate is accumulating state and the pool won't stretch, so it writes a sorted run to disk and carries on.

Then reads it back to merge. **You pay for it twice.**

### The two numbers in the UI measure different things
| | |
|---|---|
| **Spill (Memory)** | the size it had *in memory*, deserialized |
| **Spill (Disk)** | the size *written*, serialized and compressed |

A large memory figure against a small disk figure is **normal** — it's the same data, measured twice, on either side of serialization. Don't read it as a ratio.

### And the fix is almost never more memory
Spilling means a **partition was too big.** So:
- **More partitions** — each one smaller
- **Or fix the skew** — if only *one* task is spilling, it's not a memory problem, it's a distribution problem

> Non-zero spill isn't automatically a crisis. Every task spilling a little is fine. One task spilling enormously is not.`,
  narration:
    "Spilling is execution memory running out, and it's worth being clear that it's execution, not storage. A sort is accumulating rows, or an aggregation is building up state, or a hash join is constructing its build side — and the pool won't stretch any further. So the operator writes a sorted run out to disk, empties its buffer, and carries on. Later it reads those runs back to merge them. Which means you pay for that data twice: once writing, once reading. Now the two numbers in the Spark UI, because they confuse people. Spill parenthesis memory is the size the data occupied in memory, as deserialized objects. Spill parenthesis disk is the size actually written out, serialized and compressed. Those measure the same data on either side of serialization, so it is completely normal to see a very large memory figure next to a much smaller disk figure — a ten-to-one ratio isn't unusual, because deserialized JVM objects are bloated and compressed bytes are not. Don't read that as a ratio meaning anything. Here's the part that matters for what you do about it. The fix for spilling is almost never more memory. Spilling means a partition was too big for the memory a task had. So the answer is to make partitions smaller — increase the partition count, so each task handles less. Or, if only one task is spilling while the others are fine, then it isn't a memory problem at all. It's a distribution problem — skew — and no amount of memory will fix it, because the memory is fine everywhere except on the one task holding forty percent of the data.",
}
