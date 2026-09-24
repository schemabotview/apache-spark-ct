import type { Section } from '../types'

export const theCostModel: Section = {
  id: 'the-cost-model',
  title: 'The cost model, and its one weakness',
  scene: 'cat-cost-model',
  focus: 'wrong',
  slide: `## The cost model

Candidates are compared on **estimated sizes** — and *estimated* is the load-bearing word.

| Input | How reliable |
|---|---|
| **Catalog statistics** | good — *if* \`ANALYZE TABLE\` ever ran |
| **File sizes** | compressed bytes, 5–10× smaller than memory |
| **Heuristics** | a filter keeps… some fraction? |

Then: *right side under 10 MB → BroadcastHashJoin.*

### The one weakness
A wrong estimate doesn't make Spark choose badly **sometimes**. It makes it choose badly on **every run, identically**, until the estimate changes.

There's no feedback — a static plan never learns it was wrong.

### Two fixes, in order
1. \`ANALYZE TABLE\` — fixes the *cause*
2. **AQE** — re-decides after a shuffle, with measured numbers

> A hint is the third option and the worst: it's a constant, and your data isn't.`,
  narration:
    "So how does Spark choose between physical candidates? It estimates their cost, and the estimate is built from three ingredients of decreasing reliability. Best case, catalog statistics — actual row counts and column statistics, but only if someone ran ANALYZE TABLE. Next, file sizes on disk, which are compressed bytes and can easily be five or ten times smaller than the same data in memory. And then heuristics: if there's a filter, some assumed fraction of rows survive it. Spark doesn't know the real selectivity, so it guesses. From those it computes estimated sizes, and applies rules like: the right side of this join estimates under ten megabytes, so broadcast it. Now here's the weakness, and I want to state it precisely because it's the thing that makes plans go wrong in production. A bad estimate doesn't make Spark choose badly occasionally, in a way you'd notice as flakiness. It makes Spark choose badly deterministically — the same wrong choice, on every single run, forever, until something changes the estimate. Because there's no feedback loop. A statically-planned query runs, takes four hours, finishes, and nothing anywhere records that the plan was wrong. Tomorrow it does exactly the same thing. There are two fixes, in order of preference. First, run ANALYZE TABLE, which fixes the cause: give the optimizer real numbers and it makes real decisions. It's cheap and almost nobody does it. Second, turn on adaptive query execution, which lets Spark re-decide after a shuffle using sizes it has actually measured rather than estimated. There's a third option, which is to force a hint, and it's the worst of the three — a hint is a constant baked into your code, and your data isn't constant.",
}
