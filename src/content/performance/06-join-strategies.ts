import type { Section } from '../types'

export const joinStrategies: Section = {
  id: 'join-strategies',
  title: 'Choose and evaluate join strategies',
  scene: 'join-choice',
  focus: 'join-table',
  slide: `## Choosing and evaluating joins

### Worked: 10M orders ⋈ 1M customers
- **SortMergeJoin** (default, AQE off): 130.8 MB shuffled, **5.41 s**
- **ShuffledHashJoin** hint: same shuffle, no sort — **3.85 s**
- **Broadcast** hint: no shuffle at all — **3.31 s**
- Checksum identical for all four

### Why the default was sort-merge
- Estimated size with all 3 columns: **11.18 MB**, over the 10 MB threshold
- \`customer_id\` alone: **3.73 MB** — a query reading only that column **was broadcast**

### The misconception
"Each table pair has one join strategy." The estimate — and the strategy — depends on the **columns the query reads**.`,
  narration:
    "Joins are often the most expensive operators in a plan, and Spark has several ways to run them. To compare them fairly, we joined ten million orders to a million customers and grouped by customer segment, the same query each time, with the same checksum every time. With adaptive execution off, Spark's default was a sort merge join. It shuffled about a hundred and thirty megabytes, sorted both sides, and took five point four one seconds. A shuffle hash join hint kept the same shuffle but skipped the sort, building a hash table instead, and took three point eight five. A broadcast hint sent the whole customer table to every task, so nothing was shuffled at all, and it was fastest at three point three one. Why did Spark not broadcast on its own? Its estimate for the customer table, with all three columns, was eleven point one eight megabytes, just over the ten megabyte threshold. And here is something that caught us out while measuring. An earlier query that read only the customer id column estimated just three point seven three megabytes, and Spark broadcast it without being asked. So the misconception to drop is that a pair of tables has one join strategy. Spark decides from the estimated size of what the query actually reads, after columns are pruned. Always check the strategy in the executed plan of the exact query you are timing.",
}
