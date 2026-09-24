import type { Section } from '../types'

export const pandasUdfs: Section = {
  id: 'pandas-udfs',
  title: 'Pandas UDFs: one line different',
  scene: 'pyb-pandas-udfs',
  focus: 'code',
  slide: `## Pandas UDFs

Arrow is the transport. A **pandas UDF** is how you write against it.

\`\`\`python
@udf("double")                      # per ROW
def plus_one(v: float) -> float:
    return v + 1.0

@pandas_udf("double")               # per BATCH
def plus_one_fast(s: pd.Series) -> pd.Series:
    return s + 1.0
\`\`\`

Same Python. Same answer. Typically **an order of magnitude** apart.

### The type hints are not documentation
They're how Spark decides **which kind of UDF this is**:

| Signature | Kind |
|---|---|
| \`Series → Series\` | scalar |
| \`Series → scalar\` | aggregate |
| \`Iterator[Series] → Iterator[Series]\` | iterator (next section) |

Get the hint wrong and you get an error at registration — which is the good outcome.

> \`s + 1.0\` on a Series is NumPy over a contiguous column. The loop is in C, not Python.`,
  narration:
    "Arrow is the transport mechanism. A pandas UDF is how you write code that uses it. Here are the two versions side by side. The plain UDF is decorated with udf, takes a float, returns a float, and Spark calls it once per row. The pandas version is decorated with pandas_udf, takes a pandas Series, returns a pandas Series, and Spark calls it once per Arrow batch — with about ten thousand rows in that Series. Same Python, in the sense that the logic is identical. Same answer. And typically an order of magnitude apart in speed, for a change of one decorator and one type hint. Now, the type hints. These are not documentation, and this is the thing to actually remember from this section. Spark reads your type hints to decide which kind of pandas UDF you've written. Series to Series means a scalar UDF — one value out per value in. Series to a plain scalar means an aggregate UDF, which you use inside a groupBy dot agg. And Iterator of Series to Iterator of Series means an iterator UDF, which we'll come to next. If you get the hint wrong, you get an error at registration time, and that's genuinely the good outcome — the alternative would be silently getting the wrong kind. One more thing worth appreciating. When you write s plus one point zero on a pandas Series, that's not a Python loop adding one to ten thousand values. It's NumPy, operating on a contiguous block of memory, with the loop running in compiled C. So you've eliminated the per-row crossing and the per-row Python interpretation, both.",
}
