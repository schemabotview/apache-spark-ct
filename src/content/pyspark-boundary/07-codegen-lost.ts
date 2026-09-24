import type { Section } from '../types'

export const codegenLost: Section = {
  id: 'codegen-lost',
  title: 'What the UDF breaks around itself',
  scene: 'pyb-codegen-lost',
  focus: 'with',
  slide: `## What it breaks around itself

### Without a UDF
\`\`\`
*(1) Project
+- *(1) Filter
   +- *(1) FileScan
\`\`\`
All \`*(1)\` — one fused, generated Java loop.

### With one Python UDF in the middle
\`\`\`
*(2) Project
+- BatchEvalPython [clean(…)]     ← no *
   +- *(1) FileScan
\`\`\`
\`BatchEvalPython\` has **no asterisk**. It's a wall. The loop that held three operators is now two loops with a process boundary between them.

### And it's opaque to the optimizer too
A filter expressed *inside* a UDF can't be pushed down — Catalyst can't read it.

\`\`\`python
df.filter(my_udf(col("x")))   # nothing pushes down
df.filter(col("x") > 10)      # pushed into the scan
\`\`\`

> So the cost isn't only running your function. It's everything around it that now can't be fused, reordered, or pushed.`,
  narration:
    "There's a third cost, and it's the one people miss entirely, because it's not about the UDF — it's about everything near it. Look at a plan without a UDF. Project, Filter and FileScan all carry asterisk bracket one, meaning they were fused into a single generated Java loop. One pass, values in registers, no intermediate rows. Now insert one Python UDF. The plan gains a node called BatchEvalPython, and crucially it has no asterisk. It cannot be part of a code generation stage, because there's nothing to generate — the logic isn't available to Spark. So it becomes a wall. What was one fused loop is now two separate loops with a process boundary in the middle, and rows have to be fully materialised on both sides of it to cross. You didn't add the cost of one operator; you broke the loop that contained three. And there's a second version of the same problem, at the optimizer level rather than the code generation level. If you express a filter inside a UDF — pass a column to your function and filter on the result — Catalyst cannot push that down into the scan, because it has no idea what your function does. It might return anything. So the file reader reads every row, the UDF runs on every row, and then rows get discarded. Write the same condition as a plain column expression and it gets pushed all the way into the Parquet reader, and most rows are never read at all. Same logic, same result, and the difference is whether the optimizer could see it.",
}
