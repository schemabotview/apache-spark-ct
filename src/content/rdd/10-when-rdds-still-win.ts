import type { Section } from '../types'

export const whenRddsWin: Section = {
  id: 'when-rdds-still-win',
  title: 'When to use RDDs directly: rarely',
  scene: 'rdd-when-still',
  focus: 'still',
  slide: `## When to use RDDs directly

**The default answer is: don't.** Understand them — everything is built on them. Write against DataFrames.

### What you give up
An RDD is **opaque to the optimizer**. A lambda is a black box, so Spark runs exactly what you wrote.

- **No Catalyst** — no pushdown, no reordering, no column pruning
- **No Tungsten** — JVM objects, not compact binary rows
- **No AQE** — nothing re-plans at runtime

In PySpark it's worse: RDD ops serialise every row to a Python process.

### What still justifies them
- **Truly unstructured input** — before any schema exists
- **You need the partitioner** — custom placement
- **Per-partition control** — one DB connection per partition

> Not deprecated, and not going away. Just no longer where you should be writing.`,
  narration:
    "Let's close with the practical question: should you write RDD code? Almost always, no. Understand RDDs, because everything in Spark is built on them and the vocabulary is everywhere. But write against DataFrames. Here's the concrete reason. An RDD is opaque to the optimizer. When you pass a lambda to map, that function is a black box — Spark cannot see inside it, cannot know which columns it touches, cannot tell whether it filters anything. So it does exactly what you wrote, in the order you wrote it. Three things you lose. Catalyst can't optimise: no predicate pushdown, no reordering, no column pruning, because it doesn't know what your function does. Tungsten can't help: you get JVM objects rather than compact binary rows, which costs memory and garbage collection. And adaptive query execution has nothing to re-plan. In PySpark it's worse still, because RDD operations serialise every row out to a Python process and back, whereas DataFrame operations stay inside the JVM entirely. So when do RDDs still earn their place? Three cases, and they're narrow. Truly unstructured input — you're parsing something strange before any schema exists, and there's nothing for a DataFrame to be. Second, when you need control of the partitioner, placing data in a specific custom way the DataFrame API won't express. And third, per-partition control: mapPartitions lets you do setup once per partition rather than once per row, which is how you open a single database connection for a whole partition instead of a million connections. Each of those is something the structured API genuinely cannot express, not a stylistic preference. And to be clear — the RDD API isn't deprecated and isn't going anywhere. It's the layer everything else compiles down to. It's just no longer the layer you should be writing at.",
}
