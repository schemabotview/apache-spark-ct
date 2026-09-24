import type { Section } from '../types'

export const dppVsStatic: Section = {
  id: 'dpp-vs-static-pruning',
  title: 'Dynamic vs static pruning',
  scene: 'aqe-dpp-vs-static',
  focus: 'note',
  slide: `## Dynamic vs static

| | Static | Dynamic |
|---|---|---|
| **The filter** | one you wrote | one Spark **derived** |
| **Decided** | at plan time | at run time |
| **Needs** | a literal in the query | a join + a partitioned fact table |

\`WHERE year = 2026\` is static: the value is a literal, visible before anything runs, and directories are excluded immediately.

DPP is the same *pruning*, with a filter that couldn't be known until part of the job had executed.

### And DPP is **not** part of AQE
Despite arriving in the same release and being discussed together. Separate optimization, separate setting, on by default since **3.0** — a version earlier than AQE's default.

### What it needs to work
- The fact table must be **partitioned on the join key** — no partitions, nothing to prune
- The dimension side must be **broadcastable**, so it can run first and cheaply

> Which makes it another reason partitioning choices matter: DPP can only prune what you partitioned by.`,
  narration:
    "It's worth separating dynamic partition pruning from ordinary pruning, because they're often conflated and they work quite differently. Static pruning is what happens when you write where year equals twenty twenty-six. The value is a literal, sitting in your query text, visible to the optimizer before anything runs. So Spark excludes directories immediately, at plan time, and never thinks about them again. Dynamic pruning achieves the same thing — excluding directories — but with a filter that couldn't possibly be known at plan time, because its values had to be computed by running part of the job. Same mechanism at the storage layer, completely different provenance for the filter. Now a point of precision that matters if you're reading documentation. Dynamic partition pruning is not part of adaptive query execution. They arrived in the same release, Spark three point zero, they're discussed together constantly, and they're frequently assumed to be the same feature. They aren't. DPP has its own configuration setting, and it's been on by default since three point zero — a version earlier than AQE's default, which came in three point two. You can have one without the other. Two conditions for DPP to actually do anything, and both are about how you laid your data out. The fact table has to be partitioned on the join key — if it isn't partitioned, there are no directories to prune, and the derived filter just becomes an ordinary row filter. And the dimension side has to be broadcastable, so it can run first and cheaply. Which makes this one more reason your partitioning choices matter: DPP can only prune along the column you partitioned by.",
}
