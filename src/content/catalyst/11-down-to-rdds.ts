import type { Section } from '../types'

export const downToRdds: Section = {
  id: 'down-to-rdds',
  title: 'Down to RDDs: Spark is a compiler',
  scene: 'cat-to-rdds',
  focus: 'codegen',
  slide: `## Down to RDDs

The selected physical plan is still a tree of operators. Two things happen to it.

### 1 · Whole-stage code generation
A run of operators is compiled into **one generated Java method**. Scan, filter and project stop being three objects calling each other and become one fused loop.

\`\`\`
*(1) Filter (country#9 = IN)
     ↑ the star marks a codegen stage
\`\`\`

No virtual calls, no intermediate rows, and the JIT can optimize it like handwritten code.

### 2 · RDDs
The result is executed as **RDD operations** — the same partitions, tasks, stages and lineage as everything else. Nothing new runs your query.

### So the whole pipeline is
\`\`\`
SQL/DataFrame → unresolved → analyzed
  → optimized → physical → Java → RDDs
\`\`\`

> That's a compiler. Source language in, optimized target code out — which is exactly why Spark is described as one.`,
  narration:
    "We're nearly at the end of the pipeline. Spark has chosen a physical plan, but that plan is still a tree of operator objects — it isn't yet anything a machine runs. Two things happen. First, whole-stage code generation. Rather than executing the tree by having each operator call the next one — which means a virtual method call per operator per row, and an intermediate row object at every step — Spark generates Java source code that fuses a whole run of operators into a single loop. Scan, filter, project become one method with the filter inlined into the read loop. That gets compiled at runtime. The effect is large: no virtual calls, no intermediate objects, and the JVM's JIT compiler can optimize it the way it would optimize handwritten code. You can see where this applied in the plan, because operators inside a code generation stage are marked with an asterisk and a stage number. Second, the result is executed as RDD operations. And that's a nice place to land, because it means everything from the earlier parts of this subject still applies exactly. The same partitions. The same tasks. The same stages cut at shuffles. The same lineage-based recovery. There is no second execution engine hiding under the structured API — DataFrames are a much better way of describing work, and the work itself runs the way it always did. So look at the whole pipeline. SQL or DataFrame code, to an unresolved plan, to an analyzed plan, to an optimized plan, to a physical plan, to generated Java, to RDDs. Source language in, optimized target code out. That is a compiler, in the ordinary sense of the word, and it's exactly why people describe Spark as one.",
}
