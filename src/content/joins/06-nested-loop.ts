import type { Section } from '../types'

export const nestedLoopJoin: Section = {
  id: 'nested-loop',
  title: 'Nested loop: the one you never want',
  scene: 'joins-nested-loop',
  focus: 'cost',
  slide: `## Nested loop: the one you never want

Every other strategy needs an **equality** to hash on. Take that away and only this is left.

### What forces it
- A **range** condition — \`ON a.ts BETWEEN b.start AND b.end\`
- An **inequality** — \`ON a.price > b.floor\`
- **No condition at all** — a cross join, usually written by accident

### The cost
\`\`\`
1M rows × 1M rows = 1,000,000,000,000 comparisons
\`\`\`
There is no partitioning to exploit, because there's no key to partition on. Nothing warns you.

### When the condition is genuinely non-equi
- **Broadcast the small side** — \`BroadcastNestedLoopJoin\`. Still O(n×m), but no shuffle.
- **Manufacture an equi-key** — join on the *day*, then filter the range inside it. One enormous comparison becomes many tiny ones.`,
  narration:
    "The last strategy is the one you hope never to see, and understanding why it exists tells you something about all the others. Every strategy so far depended on one thing: an equality in the join condition. An equals sign is what lets you hash. Hashing is what lets you decide, for a given row, which single partition its match must be in. Take away the equality and that whole mechanism collapses. If your condition is a range — a timestamp between a start and an end — there's no single partition a matching row must be in. It could be any of them. So Spark falls back to the only thing that's always correct: compare every row against every row. A million rows against a million rows is a trillion comparisons. And nothing warns you. The query is valid, the plan is valid, the job just never finishes. The most common way people hit this is an accidental cross join — a join condition that got dropped, or a condition that references only one side. So the first thing to do is look at the plan for the word CartesianProduct, because that's almost never what anyone meant. But sometimes the condition really is non-equality. You genuinely need every event whose timestamp falls inside a session window. Two things help. One, get the small side broadcast, which gives you a broadcast nested loop join — still order n times m, but with no shuffle at all. And two, manufacture an equality where you can: join on the calendar day first, then apply the range condition inside each day. You've turned one enormous comparison into a few hundred tiny ones.",
}
