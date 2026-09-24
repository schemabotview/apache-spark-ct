import type { Section } from '../types'

export const oneEngine: Section = {
  id: 'one-engine',
  title: 'One engine, four libraries',
  scene: 'origins-one-engine',
  focus: 'core',
  slide: `## One engine, four libraries

Remove the disk round-trip and the reason for the zoo disappears. The specialists collapse back into **libraries over one core.**

| Library | Replaces |
|---|---|
| **Spark SQL** | Hive, Impala |
| **Structured Streaming** | Storm |
| **MLlib** | Mahout |
| **GraphX** | Giraph |

### Why sharing the layer below is the whole point
All four compile down to **the same DAG of tasks**. One scheduler, one memory model, one failure model.

So a SQL read feeding an ML model isn't two systems handing files to each other. It's **one plan**, and the engine optimizes across the boundary:

- The handoff stays **in memory** — no disk at the borders
- A filter written after a join can be **moved into the scan** beneath it

### And one more thing it unified
Scala, Java, Python, R and SQL all produce the same plan. On the structured APIs, **the language you write in stops affecting performance.**`,
  narration:
    "Once you've removed the disk round-trip, something interesting happens to the zoo: the reason for it evaporates. Those specialist engines existed because the shared layer underneath was too slow to share. Make the shared layer fast, and they don't need to be separate systems any more — they can be libraries. So that's what Spark is. Spark SQL does what Hive and Impala did. Structured Streaming does what Storm did. MLlib replaces Mahout. GraphX replaces Giraph. But calling them libraries rather than engines is the whole point, and it's worth being precise about why. All four of them compile down to exactly the same thing: a DAG of tasks, run by one core engine, with one scheduler, one memory model, and one failure model. So when you read a table with SQL and feed it into a machine learning model, that is not two systems handing a file to each other. It's a single plan. The handoff never touches disk, because it never leaves the engine. And better, the optimizer can see across the boundary — a filter you wrote after a join can be pushed down into the file scan underneath it, because both sides are the same kind of object. That's not something you can do when Hive hands a Parquet file to Mahout. One more unification worth mentioning, because it surprises people. Scala, Java, Python, R and SQL all produce the same plan. On the structured APIs, the language you write in stops affecting performance — your Python describes a result, the engine executes it on the JVM, and it runs the same as if you'd written Scala. There's an important exception when you drop to Python user-defined functions, but that's a story for another course.",
}
