import type { Section } from '../types'

export const optimisationAndStrategy: Section = {
  id: 'optimisation-and-strategy',
  title: 'Logical optimisation and physical strategy selection',
  scene: 'optimise-and-choose',
  focus: 'join-strategies',
  slide: `## Optimisation and physical strategy

### Rules the optimizer applied
- **Predicate pushdown:** the status filter moves under the join, into \`PushedFilters\`
- **Inferred filters:** \`isnotnull(store_id)\` on both sides
- **Column pruning:** \`ReadSchema\` holds 3 of the 4 order columns
- **Constant folding:** \`(2 + 3)\` became \`5\` before any row ran

### Choosing the join
- \`stores\` is far under the **10 MB** broadcast threshold → \`BroadcastHashJoin\`
- With broadcasting disabled → \`SortMergeJoin\`: **both** sides shuffled and sorted

### The misconception
"\`PushedFilters\` means fewer rows read." Still **1,000,000** read: Parquet skips only row groups its statistics rule out.`,
  narration:
    "Once the plan is analyzed, the optimizer rewrites it with rules that never change the result, only the cost. Look at the optimized plan. The filter on status now sits beneath the join, right next to the order data, so the join only sees completed orders. The optimizer has also inferred new filters. Because an inner join can never match a null key, it added is not null on store id on both sides. Columns are pruned. The order table has four columns, but the plan reads only three, which shows up as the read schema in the scan. And small arithmetic is folded. In a separate query, amount times two plus three became amount times five before any row was touched. Then comes the physical choice, and for joins it matters most. The store table is tiny, far below the broadcast threshold of ten megabytes, so Spark chose a broadcast hash join. It sends the whole store table to every task and leaves the order data where it is. Disable broadcasting, and the same query becomes a sort merge join. Now both sides are shuffled by store id into two hundred partitions and sorted before they can be merged. That is two extra exchanges for the same answer. One last misconception. Seeing pushed filters in the scan does not mean fewer rows were read. The stage still read all one million rows, because Parquet can only skip whole row groups whose statistics rule them out, and every row group here contained completed orders.",
}
