import type { Section } from '../types'

export const recomputeNotReplicate: Section = {
  id: 'recompute-not-replicate',
  title: 'Recompute, don’t replicate',
  scene: 'rdd-recompute',
  focus: 'condition',
  slide: `## Recompute, don't replicate

Two ways to survive losing a machine.

| | Cost | Paid |
|---|---|---|
| **MapReduce** | 3× storage and write traffic | **always** |
| **Spark** | a lineage graph, a few KB | **on failure**, for what was lost |

On a healthy cluster Spark pays nothing at all for fault tolerance.

### The condition that makes it work
**Every transformation must be deterministic.** Same input, same output — or recovery silently produces different data than it replaced.

Spark can't check this:
- No \`random()\`, no wall clock, no mutable external state
- A \`map\` with a side effect may run **twice**, or **not at all**

> Speculative execution runs the same task twice on purpose. Non-deterministic code makes that a race, not a redundancy.`,
  narration:
    "Let's make the fault-tolerance trade explicit, because it's a genuine engineering decision with two sides. MapReduce buys safety with copies. Every intermediate result gets written to HDFS and replicated, typically three times. Lose a machine and you've lost nothing, because two other copies exist. The cost is three times the storage and three times the write traffic, and — this is the key part — you pay it always. Every job, every step, whether or not anything ever fails. It's insurance with a premium on every transaction. Spark buys safety with a recipe. Instead of copies of the data, it keeps the lineage graph: a description of how each partition was made. That's a few kilobytes on the driver for an entire job. Lose a machine and Spark recomputes what was on it. So the cost is nearly zero normally, and you only pay on failure, and only for the partitions actually lost. On a healthy cluster, Spark pays nothing at all for fault tolerance. That's the trade, and it's a good one. But it rests on a condition, and I want to be direct about it because it can bite you in production without ever producing an error. Every transformation has to be deterministic. Same input, same output, every time. If it isn't, then recovery doesn't restore what was lost — it produces something different, silently. So: no random numbers inside a map, no reading the wall clock, no depending on mutable external state. And be careful with side effects — a map that writes a row to a database may run twice, or may not run at all, depending on what fails where. Spark makes no promise about that. In fact speculative execution deliberately runs the same task in two places at once to beat stragglers. If your function isn't deterministic, that isn't redundancy. It's a race.",
}
