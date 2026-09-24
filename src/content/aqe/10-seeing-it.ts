import type { Section } from '../types'

export const seeingIt: Section = {
  id: 'seeing-it',
  title: 'Seeing what it decided',
  scene: 'aqe-seeing-it',
  focus: 'code',
  slide: `## Seeing what it decided

### \`isFinalPlan\` is the flag to read
\`\`\`
AdaptiveSparkPlan isFinalPlan=false   ← a guess
AdaptiveSparkPlan isFinalPlan=true    ← what happened
\`\`\`

Explain **before** running and you get \`false\` — the static plan, which may be nothing like what executes. Explain the same DataFrame **after** an action and you get \`true\`, with both the **Final Plan** and the **Initial Plan** printed side by side.

That's the single most useful diff in Spark: what it thought, next to what it did.

### The operators AQE inserts
| | |
|---|---|
| \`AQEShuffleRead coalesced\` | partitions were merged (§4) |
| \`AQEShuffleRead skewed\` | a partition was split (§6) |
| \`BroadcastHashJoin\` where the initial plan had \`SortMergeJoin\` | the strategy changed (§5) |

> The **SQL tab** shows both plans together — easier to read than \`explain\` output, and it's where to start.`,
  narration:
    "Let's finish with how to see any of this, because adaptive execution changes what explain means and that catches people out. If you call explain on a DataFrame before running it, you get a plan with AdaptiveSparkPlan, isFinalPlan equals false at the top. That false is doing important work. It's telling you this is the static plan — the guess — and that it may be nothing like what actually executes. People print that, see a sort-merge join, and conclude their query does a sort-merge join. It might not. Now run an action, and explain the same DataFrame again. Now isFinalPlan is true, and you get something much more useful: both plans printed together. There's a Final Plan section showing what actually ran, and an Initial Plan section showing what was originally planned. That side-by-side is, I think, the single most useful diff available in Spark — what the optimizer thought, next to what it did. Three things to look for in the final plan. AQEShuffleRead with the word coalesced means partitions were merged. AQEShuffleRead with the word skewed means a partition was split. And if you see a BroadcastHashJoin in the final plan where the initial plan had a SortMergeJoin, the strategy was switched mid-flight — which is the big one. In practice the easiest place to look at all of this is the SQL tab in the Spark UI, which renders both plans as a diagram with the metrics attached. It's considerably easier to read than explain output, and it's where I'd start rather than finish.",
}
