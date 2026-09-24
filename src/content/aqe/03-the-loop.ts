import type { Section } from '../types'

export const theLoop: Section = {
  id: 'the-loop',
  title: 'Plan a bit, run a bit, look, plan again',
  scene: 'aqe-loop',
  focus: 'loop',
  slide: `## The loop

\`\`\`
run a query stage
  → read its real statistics
  → re-optimize what's left
  → repeat at the next shuffle
\`\`\`

Catalyst runs **again**, on the remaining plan, now knowing the truth about everything upstream.

### Which changes what a plan *is*
| | |
|---|---|
| **Before** | one plan, fixed at submit time |
| **After** | a plan per stage, each better informed than the last |

### \`spark.sql.adaptive.enabled\` — **on by default since Spark 3.2**
That matters for how you read older advice. Anything telling you to *turn AQE on* was written for 3.0 or 3.1. On a current cluster the question isn't whether to enable it — it's **knowing what it's already doing to your query.**

> Which is also why a plan you print before running doesn't match what ran. §10.`,
  narration:
    "So the mechanism is a loop. Run a query stage to completion. Read the real statistics it produced. Re-optimize everything that's left, now knowing the truth about everything upstream. Then run the next stage, and repeat at the next shuffle. Catalyst literally runs again — the same optimizer, the same rules, but this time with measured numbers substituted for the estimates in the part of the plan that's already executed. And that changes what a plan is, conceptually. Before, a plan was one artefact, fixed when you submitted the job, executed as written. Now it's a sequence: a plan per stage, each one better informed than the last, because each one has more measured data behind it. Now, the configuration detail that matters most for reading anything written about this. Spark dot sql dot adaptive dot enabled has been true by default since Spark three point two. And that's a meaningful dividing line, because a great deal of the writing about AQE — including most of what you'll find by searching — was written for three point zero or three point one, when it was off by default. So that advice tells you to turn it on. On any current cluster, it's already on. The question isn't whether to enable it; it's knowing what it's already doing to your query, because it is doing things, whether or not you asked. And that leads directly to a practical consequence that confuses people, which is that the plan you print before running a query doesn't match the plan that actually ran. We'll come back to that at the end.",
}
