import type { Section } from '../types'

export const readingTheUi: Section = {
  id: 'reading-the-ui',
  title: 'Reading a real shuffle in the UI',
  scene: 'shuffle-reading-ui',
  focus: 'metrics',
  slide: `## Reading a real shuffle in the UI

Nine sections of mechanism, now as six numbers you can look at on port **4040**.

### Start with the plan, not the UI
\`\`\`
df.explain()  →  no "Exchange"?  no shuffle.
\`\`\`

### Then the Stages tab
Six numbers, on the stage at the **read side** of an Exchange — they're on the left, and every one of them is a symptom an earlier section explained.

### The order to fix things in
1. **Remove** the shuffle — broadcast, bucket, reuse the partitioning (§8)
2. **Right-size** it — turn on AQE and let it measure (§9)
3. **Only then** tune by hand (§6)`,
  narration:
    "Let's finish by turning all of that mechanism into things you can actually look at. Start with the plan rather than the UI, because it's faster. Call explain on your DataFrame and search for the word Exchange. No Exchange, no shuffle, and none of this matters for that query. If there is one, open the Spark UI on port four thousand and forty, go to the Stages tab, and find the stage on the read side of that Exchange. Six numbers there tell you almost everything. Shuffle Read should be roughly the same as Shuffle Write; if it's dramatically larger, you're re-shuffling data you already shuffled. Compare maximum task duration against the median — within about two times is normal, a hundred times is skew. Look at the spill columns; they should be zero, and anything else means your partitions are too big for the memory available. Look at the task count: if it's exactly two hundred, that's the default and nobody sized it for this job. Check GC time, because a task spending a third of its life in garbage collection is thrashing rather than computing. And if you see stages marked skipped, don't go hunting for a bug — that's shuffle persistence doing its job. Last thing: fix these in the right order, because it's the order of how much they save. First, try to remove the shuffle altogether — broadcast the small side, bucket the table, stop throwing away partitioning you already had. Second, if it has to happen, let adaptive execution size it, since it can measure and you can only estimate. And only after those two should you start hand-tuning partition counts. That's the shuffle. Everything expensive about Spark either is this, or is caused by it.",
}
