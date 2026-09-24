import type { Section } from '../types'

export const readingAPlan: Section = {
  id: 'reading-a-plan',
  title: 'Reading all four plans',
  scene: 'cat-reading-plan',
  focus: 'code',
  slide: `## Reading all four plans

\`\`\`
df.explain(True)     # all four
df.explain()         # physical only
\`\`\`

| Plan | Tells you |
|---|---|
| **Parsed** | what you asked for — names only, unresolved |
| **Analyzed** | names bound, types known, \`#ids\` assigned |
| **Optimized** | which **rules fired** — diff it against Analyzed |
| **Physical** | **how** it will run |

### The trick worth having
**Diff Analyzed against Optimized.** Everything that moved, disappeared or got simpler is an optimization that fired. Everything still in the same place is one that *didn't* — and that's usually the interesting part.

### In the physical plan
- \`Exchange\` — a shuffle, a stage boundary. Count them.
- \`*(n)\` — a whole-stage codegen stage
- \`PushedFilters\` / \`ReadSchema\` — did pushdown and pruning actually happen?

> Every claim in this course is checkable here, on your own query, in about ten seconds.`,
  narration:
    "Let's close with how to see all of this yourself, because every claim in this course is checkable in about ten seconds on your own query. Call explain with true and you get all four plans. Parsed shows what you asked for, with unresolved names carrying apostrophes. Analyzed shows the same tree with every name bound to a real column, types known, and attribute ids assigned. Optimized shows what the rules did to it. And physical shows how it will actually run. Now here's the technique that makes this genuinely useful rather than just interesting. Diff the analyzed plan against the optimized one. Everything that moved, disappeared, or got simpler between those two is an optimization that fired — you can see your filter migrate down the tree, watch a Project appear where columns got pruned, see constants collapse. And more importantly, everything that stayed in exactly the same place is an optimization that didn't fire. That's usually the interesting part. If your filter is still sitting above the join in the optimized plan, there's a reason — maybe it's a left outer join, maybe there's a non-deterministic function in the way — and now you know where to look. In the physical plan, three things to scan for. Exchange, which is a shuffle and a stage boundary; count them, because that count is the cost of your query. Asterisk-n markers, which tell you which operators got fused into generated code. And on the scan node, PushedFilters and ReadSchema, which tell you whether predicate pushdown and column pruning actually happened rather than just theoretically applying. That's the whole optimizer, and it's all inspectable.",
}
