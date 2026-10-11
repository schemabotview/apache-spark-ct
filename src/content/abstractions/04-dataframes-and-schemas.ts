import type { Section } from '../types'

export const dataframesAndSchemas: Section = {
  id: 'dataframes-and-schemas',
  title: 'DataFrames and explicit schemas',
  scene: 'dataframe-schema',
  focus: 'schema-output',
  slide: `## DataFrames and explicit schemas

A **DataFrame** is a distributed table of rows with **named, typed columns**. Spark knows the schema before it reads the data.

### Worked: the same CSV, twice
- No schema: all four columns come back as **string**
- With a DDL schema: \`store_id\` **integer**, \`amount\` **decimal(10,2)**
- Columns read from files are **nullable**, whatever you declare

### Why declare it
- No inference pass over the input
- Money as \`DECIMAL\`, not floating point
- Wrong types fail **at the boundary**, not deep in the pipeline

### The misconception
A Spark DataFrame is not a pandas DataFrame: it is **distributed, lazy and immutable**.`,
  narration:
    "From here on, the main abstraction is the DataFrame. A DataFrame is a distributed table: rows spread across partitions, with named and typed columns. The crucial difference from an RDD is that Spark knows the schema before it touches the data, and that is what lets the optimizer reason about your query. Watch what the schema changes. Read the orders CSV with only the header option, and Spark returns four columns, every one of them a string, because by default CSV reading does not infer types. Now read it again with an explicit schema, written as a short DDL string. Store id is an integer, amount is a decimal with two places, and the six rows on the right are exactly what Spark returned. Notice one detail in the printed schema. Every column is nullable, even though we never asked for that. When Spark reads files, it treats columns as nullable, so a missing value is possible whatever you declare. Why declare the schema rather than infer it? There is no extra pass over the input. Money stays an exact decimal rather than a floating point approximation. And data of the wrong shape is caught at the boundary, not three joins later. Finally, a misconception people bring from Python. A Spark DataFrame is not a pandas DataFrame. It is not in local memory, nothing is computed until an action, and you never modify it in place.",
}
