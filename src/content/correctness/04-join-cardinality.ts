import type { Section } from '../types'

export const joinCardinality: Section = {
  id: 'join-cardinality',
  title: 'Join semantics, cardinality and duplicate amplification',
  scene: 'join-amplification',
  focus: 'join-results',
  slide: `## Joins, cardinality, duplicates

### Worked: 6 orders, 199.00 in
- \`stores\` lists store 7 **twice** (reopened in 2025)
- **inner:** 6 rows, **225.00** — o1 and o2 doubled; o7 (store 15) and o12 (NULL key) dropped
- **left:** 8 rows, **264.00**; a \`left_anti\` join finds **o7, o12**
- Deduplicate the dimension first: inner gives 4 rows, **160.00**

### Check every join
- Is the key **unique** on the side that should be unique?
- Compare row count and sum before and after
- \`countDistinct\` of the fact key should not grow

### The misconception
"NULL keys match each other." \`NULL = NULL\` is not true, so o12 never meets the NULL store row.`,
  narration:
    "Joins are where correct-looking pipelines most often produce wrong totals, because a join can change the number of rows. Here are six orders worth one hundred and ninety nine in total, and a store table in which store seven appears twice, once for its original opening and once for its 2025 reopening. Nothing about that table looks broken. Now join. The inner join returns six rows with a sum of two hundred and twenty five. Orders one and two each matched both store seven rows, so their amounts were counted twice. At the same time, order seven, for store fifteen, found no store and disappeared, and so did order twelve, whose store id is null. A left join keeps every order, so it returns eight rows and two hundred and sixty four, still inflated. A left anti join is the quickest way to list the orders that found no match: seven and twelve. The fix is to make the dimension unique before joining. Deduplicate the stores, and the inner join returns four rows and one hundred and sixty. Make three checks habitual. Is the join key unique on the side that should be unique? Do the row count and the sum change across the join in the way you expect? And does the distinct count of the order key stay the same? One more trap. The store table has a row with a null key, but order twelve still did not match it, because null equals null is not true in SQL.",
}
