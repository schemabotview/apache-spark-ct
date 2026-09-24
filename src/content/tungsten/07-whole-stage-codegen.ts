import type { Section } from '../types'

export const wholeStageCodegen: Section = {
  id: 'whole-stage-codegen',
  title: 'Whole-stage code generation',
  scene: 'tun-codegen',
  focus: 'result',
  slide: `## Whole-stage code generation

Stop interpreting the tree. **Compile it.**

Spark generates Java source for a whole run of operators, compiles it at runtime, and runs that instead.

\`\`\`java
while (scan.hasNext()) {
  row = scan.next();
  if (row.country != "IN") continue;   // Filter
  emit(row.dest, row.cnt);             // Project
}
\`\`\`

One loop. The operators no longer exist as objects — their logic is **inlined into it**.

### Why this beats the sum of its parts
| | |
|---|---|
| **No virtual calls** | nothing left to dispatch |
| **No intermediate rows** | values stay in CPU registers |
| **The JIT can optimize it** | unroll, vectorise, inline |

That last one is the real prize: a tight hand-written-looking loop is exactly what the JVM's JIT compiler is best at. Spark generates the kind of code the JIT loves.

> Spark 2.0 · \`spark.sql.codegen.wholeStage\`, on by default.`,
  narration:
    "The fix is to stop interpreting the operator tree and compile it instead. This is whole-stage code generation, it arrived in Spark 2.0, and it's one of the larger performance jumps in the project's history. Here's what happens. Instead of executing the tree by having operators call each other, Spark generates Java source code for a whole run of operators — a whole stage — and compiles that at runtime. What comes out is a single loop. While the scan has rows: get a row, if the country isn't India then skip it, otherwise emit the destination and the count. The Filter and the Project no longer exist as objects. Their logic has been inlined directly into the loop body. Three things follow, and the third is the biggest. No virtual calls, because there's nothing left to dispatch to — it's all one method. No intermediate rows, because values can live in CPU registers between operations rather than being written into objects. And the JIT compiler can now optimize it properly. That third point is the real prize. The JVM's just-in-time compiler is extremely good at optimising tight loops — it unrolls them, it can vectorise them, it inlines aggressively. What it can't do much with is a chain of polymorphic virtual calls through an object graph. So by generating code that looks like something a human would have written by hand, Spark hands the JIT exactly the shape it's best at. The result is that a generated stage can run close to the speed of purpose-written Java, on a query you expressed as a DataFrame.",
}
