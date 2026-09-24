import type { Section } from '../types'

export const arrow: Section = {
  id: 'arrow',
  title: 'Arrow: stop converting',
  scene: 'pyb-arrow',
  focus: 'arrow',
  slide: `## Arrow

The fix isn't a faster pickle. It's to **agree on one memory layout both sides can read**, and stop converting at all.

**Apache Arrow** is a columnar in-memory format. The JVM writes an Arrow batch; pandas and NumPy read that same memory directly.

\`\`\`
spark.sql.execution.arrow.pyspark.enabled = true
\`\`\`

| | |
|---|---|
| **Columnar** | a column at a time, not a row |
| **Batched** | ~10,000 rows per crossing |
| **One layout** | no per-row conversion, either direction |

### What changes
Transport cost stops scaling with your **row** count and starts scaling with your **batch** count. 10,000× fewer crossings.

And your code gets to be **vectorised** — you receive a pandas Series and operate on the whole column with NumPy, instead of looping.

> Two wins at once: the crossing is amortised, *and* the work itself gets faster.`,
  narration:
    "So how do you fix this? The instinct is to find a faster serialisation format — swap pickle for something quicker. That's the wrong idea, because it still converts every row, twice. The right idea is to stop converting at all. Apache Arrow is a columnar in-memory format, and the key property is that it's a standard both sides already speak. The JVM can write data directly in Arrow layout. Pandas and NumPy can read Arrow layout directly. So there's no translation step in either direction — the bytes the JVM wrote are the bytes Python reads. You turn it on with one configuration setting, and in recent Spark versions it's on by default for the operations that use it. Three properties matter. It's columnar, so you get a column at a time rather than a row at a time. It's batched — around ten thousand rows cross at once rather than one. And it's one shared layout, so there's no per-row conversion cost at either end. What changes is the shape of the cost. Transport used to scale with your row count: a billion rows meant a billion crossings. Now it scales with your batch count: a billion rows at ten thousand per batch is a hundred thousand crossings. Four orders of magnitude fewer. And there's a second win that's easy to overlook. Because you now receive a whole column as a pandas Series rather than one value at a time, your own code can be vectorised — you operate on the entire column with NumPy, which runs as compiled C over contiguous memory. So the crossing gets amortised and the work itself gets faster, at the same time.",
}
