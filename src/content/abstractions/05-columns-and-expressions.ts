import type { Section } from '../types'

export const columnsAndExpressions: Section = {
  id: 'columns-and-expressions',
  title: 'Columns, expressions and built-in functions',
  scene: 'column-expressions',
  focus: 'enriched-rows',
  slide: `## Columns and expressions

A **Column** is an expression to evaluate per row, not a container of values.

### Worked: three new columns
- \`amount * 100\`, cast to int → \`amount_pence\` **4000** for o1
- \`status == "COMPLETED"\` → a **boolean** column
- \`when(amount >= 50, "large").otherwise("small")\` → o3 and o5 are **large**

### Built-in functions
- \`pyspark.sql.functions\`: \`when\`, \`round\`, \`upper\`, \`coalesce\`…
- They run **inside the engine**, visible to the optimizer
- \`withColumn\` returns a **new** DataFrame each time

### The misconception
\`F.col("amount") * 100\` does not compute anything. It returns a \`Column\` — an expression tree evaluated only when an action runs.`,
  narration:
    "DataFrame code is built from columns, and a column is not what most people first assume. It is not a container of values. It is an expression, a description of how to compute one value per row. Look at the first line of the code. Multiplying the amount column by a hundred and casting it to an integer produces an object of type Column, and no data has been read. Then three with column calls attach expressions to the orders DataFrame. Amount in pence is the amount times one hundred, cast to an integer, so order one becomes four thousand. Is done compares the status with the string completed, which produces a boolean column. And size uses when and otherwise, Spark's version of an if expression: orders of fifty or more are large, so orders three and five are large and the rest are small. The table shows exactly what Spark returned. These functions come from the pyspark dot sql dot functions module, and there are hundreds of them, from round and upper to coalesce and date arithmetic. They matter because they execute inside the engine, where the optimizer can see them. A plain Python function cannot be seen that way, which is a cost the next chapter measures. Each with column also returns a new DataFrame. The original orders DataFrame is unchanged, which is why chaining reads naturally.",
}
