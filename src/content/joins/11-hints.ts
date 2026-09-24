import type { Section } from '../types'

export const hintsSection: Section = {
  id: 'hints',
  title: 'Hints, and when overriding is defensible',
  scene: 'joins-hints',
  focus: 'code',
  slide: `## Hints, and when overriding is defensible

A hint **short-circuits the selection order**. It isn't advice — Spark obeys it, including when obeying is a bad idea.

### Defensible
- The table has **no statistics**, so the estimate is a guess
- It's small but Spark **can't know** that — behind a UDF, a subquery, a non-deterministic filter
- You **measured both plans** and the optimizer's pick was slower

### Not defensible
- *"Broadcasting fixed it once"* — then the table grew and the driver died. A hint is a constant; your data isn't.
- Before trying \`ANALYZE TABLE … COMPUTE STATISTICS\` — that fixes the cause rather than overriding the symptom
- Before turning **AQE** on, which re-decides with numbers it actually measured

### Either way, check what you got
\`\`\`
df.join(other, "key").explain()
\`\`\`
\`BroadcastHashJoin\` · \`SortMergeJoin\` · \`ShuffledHashJoin\` — the plan is the only honest answer.`,
  narration:
    "Last section: the override. You can tell Spark which join strategy to use, and the important thing to internalise is what that does mechanically. A hint short-circuits the selection ladder from a few sections back. It isn't a suggestion that gets weighed against other factors. Spark will do what you said, including when what you said is a bad idea. In the DataFrame API you wrap the side you want shipped in the broadcast function. In SQL there are four hints, one per strategy: BROADCAST, MERGE for sort-merge, SHUFFLE_HASH, and SHUFFLE_REPLICATE_NL for the nested loop. So when is using one defensible? Three cases, really. When the table has no statistics, so the optimizer's estimate is close to a guess and you know better. When the table is genuinely small but Spark can't know it — because it's behind a user-defined function, or a subquery, or a filter whose selectivity is unknowable. And when you've actually measured both plans and the optimizer's choice was slower. And when is it not defensible? The big one is what I'd call hint-by-superstition: broadcasting fixed a slow query once, so now there's a broadcast hint in the code forever. A hint is a constant. Your data isn't. That table grows, and one morning the driver dies instead of the query being slow, which is a much worse failure. The other two: don't reach for a hint before you've tried computing statistics, which fixes the cause rather than overriding the symptom. And don't reach for one before turning on adaptive execution, which re-decides using numbers it actually measured rather than numbers it guessed. Whatever you do — call explain and confirm what you got. The plan is the only honest answer.",
}
