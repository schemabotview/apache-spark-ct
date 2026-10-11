import type { Section } from '../types'

export const filterGroupAggregate: Section = {
  id: 'filter-group-aggregate',
  title: 'Filtering, projection, grouping and aggregation',
  scene: 'filter-group-aggregate',
  focus: 'daily-rows',
  slide: `## Filter, group, aggregate

### The building blocks
- **Filter:** \`where\` / \`filter\` keeps rows
- **Project:** \`select\` keeps or computes columns
- **Group + aggregate:** \`groupBy(...).agg(...)\` — one row per key

### Worked: the daily summary
- 6 orders → **4** completed → 3 stores
- Store 7: 40.00 + 25.00 = **65.00** over 2 orders, average **32.50**

### Result types matter
- \`count\` is a **non-null long**
- \`sum\` of \`decimal(10,2)\` widens to **decimal(20,2)**, so it cannot overflow the input type

### The misconception
\`groupBy\` alone returns \`GroupedData\`, not a DataFrame — nothing is grouped until you call \`agg\`.`,
  narration:
    "Most batch pipelines are built from three moves. Filtering keeps the rows you want, with where or its alias filter. Projection keeps or computes the columns you want, with select. And grouping with aggregation collapses many rows into one per key. Here they are as the daily summary. The where keeps the completed orders, so six rows become four. Group by store id, then aggregate three ways: a count of orders, the sum of the amounts, and the average rounded to two places. Order by store id makes the output predictable. The result has one row per store. Store seven has two orders, forty plus twenty five, which is sixty five, with an average of thirty two fifty. Stores nine and twelve each have a single order. Now look at the types Spark reported, because they are part of the result. Count is a long, and it is never null. The sum of a decimal with ten digits and two places comes back as a decimal with twenty digits, so a large total cannot overflow the input type. If downstream code expects the original type, that difference matters. One misconception to clear up. Group by on its own does not return a DataFrame. In PySpark it returns a grouped data object, which is only a description of the keys. Nothing is grouped, and nothing can be shown, until you call agg, or one of its shortcuts such as count or sum.",
}
