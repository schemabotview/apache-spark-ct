import type { Section } from '../types'

export const narrowAndWide: Section = {
  id: 'narrow-and-wide',
  title: 'Narrow and wide dependencies',
  scene: 'narrow-vs-wide',
  focus: 'wide-deps',
  slide: `## Narrow and wide dependencies

For every step, ask: does each **output partition** need **one** input partition, or **many**?

### Narrow — no data movement
- \`where\`, \`select\`, \`withColumn\`
- Each partition is processed **where it already is**
- Consecutive narrow steps **pipeline** inside one task

### Wide — a shuffle
- \`groupBy().agg\`, \`distinct\`, \`orderBy\`, most \`join\`s
- Rows with the same key must **meet in one partition**
- Output: \`spark.sql.shuffle.partitions\` = **200** by default; AQE can coalesce

### The misconception
A \`groupBy\` sum does not ship every row: each task first sends **partial sums per store**.`,
  narration:
    "There is one question that explains most of Spark's execution behaviour. For each step, does an output partition depend on one input partition, or on many? When it depends on one, the dependency is narrow. Filters, projections and new columns are all narrow. Each partition is transformed exactly where it already sits, and a chain of narrow steps can run back to back inside the same task, record by record, without writing anything in between. Spark calls that pipelining. When an output partition depends on many input partitions, the dependency is wide. Grouping with an aggregation, distinct, sorting, and most joins are wide, because rows that share a key may be scattered across every input partition and have to meet in one place. That redistribution is the shuffle. The output side of a DataFrame shuffle has two hundred partitions by default, set by spark dot sql dot shuffle dot partitions, and in Spark four adaptive query execution is on by default and can merge small ones at runtime. Some joins avoid the shuffle by broadcasting a small table, which a later chapter covers. Now the misconception. A group by does not have to send every order across the network. For a sum, each task first adds up its own rows per store, exactly like the partial totals in chapter one, and only those partial sums are shuffled. The shuffle still costs, but far less than moving raw events.",
}
