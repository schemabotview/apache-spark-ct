import type { Section } from '../types'

export const theBet: Section = {
  id: 'the-bet',
  title: 'The bet: keep two things, change one',
  scene: 'origins-the-bet',
  focus: 'change',
  slide: `## The bet: keep two things, change one

UC Berkeley's AMPLab, 2009. The insight wasn't that MapReduce was wrong. It was that **only one part of it was.**

### Keep
- **Data parallelism** — partition the data, run the same code on each part
- **Fault tolerance** — a node dies, its work is redone, the job survives

Both were right. Neither needed replacing.

### Change
**Keep intermediate results in memory between steps**, instead of writing them to disk.

### What falls out
Iteration becomes cheap; queries come back in seconds.

And it stays fault-tolerant by **lineage** — remember how a partition was computed, recompute it if lost. MapReduce bought that with disk; a recipe is free.

> Early results: **10–20×** — a different set of programs you can write at all.`,
  narration:
    "In 2009, at Berkeley's AMPLab, a group including Matei Zaharia looked at this and made a bet. And the shape of the bet is what I'd like you to take away, because it's a good piece of engineering judgement. They didn't conclude MapReduce was wrong. They concluded that two of its three big ideas were right and should be kept. Keep data parallelism — partition the data, run the same code on every partition. That works. Keep fault tolerance — when a machine dies mid-job, and at scale one always does, the system recovers without a human. That works too. Change exactly one thing: stop writing intermediate results to disk between steps, and keep them in memory instead. Now, the obvious objection is that MapReduce wasn't writing to disk out of stupidity. It was writing to disk to get fault tolerance. If a node dies and its data was only in memory, that data is gone. So how do you keep both? The answer is lineage, and it's the genuinely clever part. Spark doesn't remember the data — it remembers how the data was made. Every partition knows the chain of operations that produced it, all the way back to something durable on disk. If a machine dies, Spark looks at that recipe and recomputes just the lost partitions. Fault tolerance without replication, and remembering a recipe is essentially free. What falls out is bigger than a speedup. Early benchmarks were ten to twenty times faster, but the real change is qualitative: loops become cheap, so iterative machine learning becomes practical, and queries come back in seconds, so you can actually explore data by asking follow-up questions. That's not a faster MapReduce. It's a different set of programs you can write at all.",
}
