import type { Section } from '../types'

export const workedBatchPipeline: Section = {
  id: 'worked-batch-pipeline',
  title: 'Worked case: a small batch pipeline',
  scene: 'batch-pipeline-case',
  focus: 'result-table',
  slide: `## Worked case: sales by city

### Trace it by hand
1. **Filter:** 6 orders → 4 (o3 cancelled, o6 pending)
2. **Join** on \`store_id\`: every order finds its city
3. **Group by city:** Leeds = o1 + o2 = **65.00**; York **15.00**; Hull **80.00**
4. **Order** by sales, descending

### Invariants to check
- Total sales **160.00** = the completed orders' sum
- **4** orders in, **4** counted; one row per city
- A store missing from \`stores\` would **drop** its orders in the inner join — and the total would fall below 160.00

### The misconception
"The rows come out in a sensible order anyway." After a shuffle there is **no order** unless you ask for one with \`orderBy\`.`,
  narration:
    "Let's finish the chapter by reading a complete small pipeline and predicting its result before Spark does. The pipeline filters the orders to completed ones, joins them to the store reference data on store id, groups by city, counts the orders and sums the sales, and sorts by sales from highest to lowest. Trace it by hand. The filter removes order three, which was cancelled, and order six, which is pending, leaving four. The join gives every remaining order its city, and because all three stores appear in the reference data, no order is lost. Grouping by city puts orders one and two together in Leeds, forty plus twenty five, sixty five. York has order four, fifteen. Hull has order five, eighty. Sorted by sales, that is Hull, Leeds, York, and that is exactly what Spark returned. Now the habit worth keeping: check invariants, not just the rows. The sales should total one hundred and sixty, the sum of the completed orders. Four orders went in, so four should be counted. And there should be one row per city. Each of those checks would catch a real bug. Suppose a new store appeared in the orders but not yet in the reference file. The inner join would silently drop its orders, and the total would fall below one hundred and sixty. The next chapter is full of failures like that. One last misconception. Without the order by, the rows might happen to look sorted on a small run, but after a shuffle Spark promises no order at all. Next, we test these pipelines against imperfect data: missing values, bad records, and joins that multiply rows.",
}
