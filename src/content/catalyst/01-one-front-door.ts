import type { Section } from '../types'

export const oneFrontDoor: Section = {
  id: 'one-front-door',
  title: 'Three doors, one tree',
  scene: 'cat-one-front-door',
  focus: 'same',
  slide: `## Three doors, one tree

SQL, DataFrames and Datasets all compile to **the same unresolved logical plan.**

\`\`\`sql
SELECT dest, count(*) FROM flights GROUP BY dest
\`\`\`
\`\`\`python
df.groupBy("dest").count()
\`\`\`

Same tree. The optimizer never learns which door you came through.

### Which settles two arguments
| | |
|---|---|
| **"SQL is faster than DataFrames"** | No. Same tree. |
| **"Python is slower than Scala"** | Not on the structured APIs — until you write a **UDF** |

That exception is real and large, but it's the only one. Pure DataFrame code in Python never leaves the JVM.

> Pick the door you can read six months from now.`,
  narration:
    "Before we look inside the optimizer, one fact that settles a surprising number of arguments. SQL, DataFrames and Datasets are three doors into the same building. Write a group-by in SQL, write it with the DataFrame API, write it as a typed Dataset in Scala — all three are parsed into exactly the same thing: an unresolved logical plan. A tree. And from that point on, nothing downstream knows or cares which door you came through. So, two things people argue about, settled. First: SQL is not faster than DataFrames, and DataFrames are not faster than SQL. They're the same tree, optimized by the same rules, executed by the same engine. Use whichever is clearer for the problem in front of you — SQL is often better for a big join-heavy query, the DataFrame API is often better when you're building something up programmatically. Second: Python is not slower than Scala on the structured APIs. This one surprises people, because it's true of almost no other system. When you write a PySpark DataFrame operation, no Python runs on your data at all. The Python API builds a plan, sends that plan to the JVM, and the JVM does all the work. Your rows never touch a Python interpreter. Now — there's one very large exception, and it's worth flagging clearly. A Python user-defined function does run Python on every row, and that changes everything about the performance profile. But that's the exception, not the rule, and it's worth a course of its own. For pure DataFrame code, the language is an ergonomic choice, not a performance one.",
}
