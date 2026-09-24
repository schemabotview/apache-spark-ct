import type { Section } from '../types'

export const dataframeIllusion: Section = {
  id: 'the-dataframe-illusion',
  title: 'Pure DataFrame code never leaves the JVM',
  scene: 'pyb-illusion',
  focus: 'zero',
  slide: `## Pure DataFrame code never leaves the JVM

\`\`\`python
df.filter(col("country") == "IN") \\
  .groupBy("dest").count()
\`\`\`

Looks like Python operating on data. It isn't.

Those Python objects were **builders**. They described a plan, sent it over Py4J, and then had nothing more to do.

| | |
|---|---|
| The plan | built in the JVM |
| Optimized by | Catalyst — the same rules as Scala |
| Executed as | generated Java, on the executors |

### Python processes involved in the data: **zero**

Which is why pure DataFrame PySpark is **not slower than Scala.** Not "nearly as fast" — the same, because it's the same generated code running on the same bytes.

> This is the mode you want to stay in. The rest of this course is about what happens when you leave it.`,
  narration:
    "Now the claim that surprises people, and it's worth stating strongly because the received wisdom is wrong. Take a normal piece of PySpark: filter on a column, group by another, count. It looks like Python operating on data. It isn't, and no Python touches your data at all. Those Python objects are builders. When you call filter, a Python object constructs a description and sends it to the JVM. When you call groupBy, another description. When you call count, the plan is executed. At that point the Python API has done its entire job, and what runs is a plan in the JVM, optimized by Catalyst using exactly the same rules it would apply to Scala, compiled to Java bytecode by whole-stage code generation, and run over binary rows on the executors. Count the Python processes involved in processing your data: zero. They're sitting idle, as they were at the start. And that's why pure DataFrame PySpark is not slower than Scala. Not nearly as fast, not within a few percent — the same, because it is literally the same generated code running over the same bytes. The language you wrote the description in has been discarded long before any data moved. I'd like this to land as more than trivia, because it has a practical consequence. It means that for the overwhelming majority of data engineering work — reading, filtering, joining, aggregating, writing — choosing Python costs you nothing at all. The performance argument for Scala, which people still make, applies to a specific and avoidable situation. And that situation is the next section.",
}
