import type { Section } from '../types'

export const immutability: Section = {
  id: 'immutability',
  title: 'Nothing is ever modified',
  scene: 'rdd-immutability',
  focus: 'chain',
  slide: `## Nothing is ever modified

\`rddB = rddA.filter(...)\` doesn't change \`rddA\` — it records that \`rddB\` **is** \`rddA\` with a filter applied.

### What immutability buys
- **No locking** — nothing can be written, so nothing needs guarding
- **Safely recomputable** — same inputs, same answer
- **Freely shareable** — two branches can read one parent

That middle one is load-bearing: **recovery by recomputation is only correct if recomputation is deterministic.**

### Where it leaks
\`\`\`
rdd.map(lambda x: x * random())
\`\`\`
Spark can't tell this isn't deterministic. On recovery you get *different data* — silently.

> A property Spark relies on. Not one it can enforce inside your function.`,
  narration:
    "In Spark, data structures are immutable. Nothing is ever modified in place. When you write rddB equals rddA dot filter, you have not changed rddA at all. You've created a new description that says: rddB is what you get if you take rddA and apply this filter. rddA is untouched and still usable. This sounds like a functional-programming nicety and it's actually load-bearing infrastructure. Three things come from it. First, no locking. If nothing can be written, nothing needs to be guarded, and a huge category of distributed concurrency bugs simply cannot occur. Second — and this is the important one — recomputation is safe. Because a transformation is a pure description, running it again on the same input gives the same output. Third, sharing is free. Two different branches of your job can both read from one parent RDD with no coordination between them. Now, hold on to that second point, because the next section depends on it completely. Spark's entire fault-tolerance story is: if we lose data, we'll just recompute it. That's only correct if recomputing genuinely reproduces what was there. Immutability is most of what guarantees it. But here's where it leaks, and it's worth knowing. Spark cannot look inside your function. If you write a map that multiplies by a random number, or one that reads the current time, or one that writes a row to an external database, Spark has no way to know it isn't deterministic. It will happily recompute it on failure, and you'll get different data than you had before — silently, with no error. Immutability is a property Spark relies on. It's not one Spark can enforce for you.",
}
