import type { Section } from '../types'

export const iteratorAndMap: Section = {
  id: 'iterator-and-map',
  title: 'Setting up once: iterator UDFs and friends',
  scene: 'pyb-iterator-map',
  focus: 'iter',
  slide: `## Setting up once

A scalar pandas UDF is called **once per batch** — so anything expensive inside it happens once per batch too.

Load a 2 GB model in there, and you load it every 10,000 rows.

### Iterator UDFs
\`\`\`python
@pandas_udf("double")
def predict(it: Iterator[pd.Series]
           ) -> Iterator[pd.Series]:
    model = load_model()      # ONCE per partition
    for s in it:
        yield pd.Series(model.predict(s))
\`\`\`

Everything before the loop runs **once per partition.** The right shape for a model, a connection, or any expensive setup.

### And two that take whole frames
| | |
|---|---|
| \`mapInPandas\` | DataFrame in, out. Row count may differ. |
| \`applyInPandas\` | one **group** at a time — it must fit in memory |

> \`applyInPandas\` inherits skew directly: one huge group is one huge pandas DataFrame.`,
  narration:
    "There's a shape problem left. A scalar pandas UDF is called once per batch, which is much better than once per row — but it means anything expensive inside the function also happens once per batch. If your function loads a machine learning model, and your partition has a million rows in a hundred batches, you've loaded that model a hundred times. For a two-gigabyte model, that's fatal. The answer is an iterator UDF. You declare it as taking an Iterator of Series and returning an Iterator of Series. Now everything you write before the loop runs exactly once, per partition. Load your model there. Open your database connection there. Then inside the loop, you receive one batch at a time and yield one result per batch. That's the correct shape for anything with expensive setup, and it's worth reaching for as soon as your function has any initialisation at all. There are two more variants worth knowing about, for when a single Series is the wrong shape. mapInPandas gives your function a whole pandas DataFrame — all the columns — and lets you return a DataFrame with a different number of rows, so you can filter or explode. And applyInPandas operates on one group at a time, after a groupBy, which is what you want when your logic genuinely needs a whole group together. But note the warning on that last one. applyInPandas loads an entire group into memory as a pandas DataFrame. So it inherits skew directly and brutally: if one group has forty percent of your rows, that's one enormous pandas DataFrame on one executor, and no amount of Spark memory management will help, because it's Python's memory.",
}
