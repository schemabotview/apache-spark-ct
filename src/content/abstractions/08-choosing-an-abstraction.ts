import type { Section } from '../types'

export const choosingAnAbstraction: Section = {
  id: 'choosing-an-abstraction',
  title: 'RDDs, DataFrames, SQL and typed Datasets',
  scene: 'abstraction-choice',
  focus: 'dataframe-card',
  slide: `## Choosing an abstraction

### Use a DataFrame or SQL when
- The data has a **schema**, or can be given one
- You want the optimizer: **pushdown, pruning, join choice**
- You may run over **Spark Connect**

### Reach for an RDD when
- Records have **no useful schema**
- You need low-level control of partitions or functions

### Typed Datasets
**Scala and Java only** — the 4.0.1 guide states Python has no Dataset API. In Scala, \`DataFrame\` is \`Dataset[Row]\`.

### The misconception
"RDDs are faster because they are lower level." In PySpark, RDD functions move every record into **Python**; DataFrame built-ins stay in the engine.`,
  narration:
    "We now have four ways to describe a computation, and they all run on the same engine. So which should you use? For structured data, the default is a DataFrame or SQL, whichever reads better for the task. They give you the optimizer: filters pushed toward the source, unused columns never read, and a join strategy chosen from the data. They are also the only option if your code runs over Spark Connect, because the RDD API is not available there. RDDs still have a place. When records have no useful schema, such as raw text that needs custom parsing, or when you need direct control over how data is partitioned and processed, an RDD is the honest tool. Then there are typed Datasets. They exist in Scala and Java, where each row can be a typed object checked at compile time. The Spark four point zero point one guide states plainly that Python has no Dataset API. In Scala, a DataFrame is simply a Dataset of generic rows. And typed lambdas share a cost with RDDs: the optimizer cannot see inside them. That brings us to the misconception. It is tempting to think RDDs are faster because they are lower level. In PySpark the opposite is usually true. An RDD function moves every record out of the engine and into a Python process and back, while DataFrame built-ins run inside the engine without leaving it.",
}
