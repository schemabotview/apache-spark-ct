import type { Section } from '../types'

export const dynamicPartitionPruning: Section = {
  id: 'dynamic-partition-pruning',
  title: 'Dynamic partition pruning',
  scene: 'aqe-dpp',
  focus: 'apply',
  slide: `## Dynamic partition pruning

The classic star-schema shape:

\`\`\`sql
SELECT ... FROM fact_sales f
JOIN dim_date d ON f.date_id = d.id
WHERE d.quarter = 'Q3-2026'
\`\`\`

The filter is on the **dimension**. The fact table has **no filter it can use** — nothing in the query mentions a fact column to prune on.

### So Spark builds the filter it needs
Run the **small side first** — it was being broadcast anyway. Collect the join keys that **survived**. Turn them into \`date_id IN (…)\` and push it into the fact table's scan.

**90 partitions read out of 730.** The rest are never listed, never opened.

### Which is the interesting part
You never wrote a filter on the fact table. Spark **derived one** from the other side of a join — a filter that couldn't exist until the dimension side had run.`,
  narration:
    "Dynamic partition pruning solves a different problem, and it's the one with the biggest wins on real data warehouses. Here's the shape, and if you've worked with a star schema you'll recognise it immediately. You have a huge fact table — sales, partitioned by date, two years of it. You have a small dimension table of dates. You join them, and you filter on a dimension column: give me the third quarter of twenty twenty-six. Now think about what the fact table can prune on. Nothing. Your query contains no filter on any fact table column. The only filter is on the dimension, on the other side of a join. So by the normal rules, Spark reads every partition of the fact table — all seven hundred and thirty days of it — joins the lot, and discards everything outside Q3. What dynamic partition pruning does is build the missing filter. The dimension side is small and is being broadcast anyway, so it runs first. Spark collects the join key values that survived the quarter filter — ninety date ids. It turns those into a predicate: date id in this set of ninety values. And it pushes that predicate down into the fact table's file scan, where it becomes partition pruning: ninety directories read out of seven hundred and thirty. The rest are never listed and never opened. The interesting part is the epistemics of it. You never wrote a filter on the fact table. Spark derived one, from the other side of a join, and the filter it derived could not have existed at planning time because the values in it weren't known until the dimension side actually ran.",
}
