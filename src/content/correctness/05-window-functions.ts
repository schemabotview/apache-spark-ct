import type { Section } from '../types'

export const windowFunctions: Section = {
  id: 'window-functions',
  title: 'Window functions and analytical transformations',
  scene: 'window-functions',
  focus: 'frame-table',
  slide: `## Window functions

A window computes over **related rows** but keeps **every row**: \`partitionBy\` groups, \`orderBy\` sorts, the **frame** bounds.

### Worked: store 7, with a tie at 25.0
- \`row_number\`: 1, 2, 3 — the tie is broken **arbitrarily**
- \`rank\`: 1, 2, 2 · \`dense_rank\`: 1, 2, 2
- Whole-partition \`sum\`: 90.0 on every row

### The default frame
- With \`orderBy\`, the frame is \`RANGE\` from the start **to the current value**
- Tied rows o2 and o6 **both** show 50.0
- For row-by-row totals, use \`rowsBetween(unboundedPreceding, currentRow)\`

### The misconception
"\`row_number\` is stable." Among ties it is not — add a **tiebreaker** column to the ordering.`,
  narration:
    "Window functions answer questions that compare a row with its neighbours: the top order per store, a running total, the previous value. Unlike a group by, a window keeps every row. You describe the window with three parts: partition by, which rows belong together; order by, their sequence; and the frame, which rows around the current one to include. Take store seven, where orders two and six are tied at twenty five. Ordered by amount, highest first, row number gives one, two and three. Rank gives one, two, two. Dense rank also gives one, two, two here, and would differ from rank only at the next value. The tied pair is the interesting part. Row number had to put one of them second and the other third, and which one is arbitrary. Run the job again, on different partitions, and the order can change. If a later step keeps only the first row per group, that is a nondeterministic result. The second table shows a subtler effect. Sum the amount over a window ordered by amount, and you might expect a running total of twenty five, then fifty, then ninety. Instead both tied rows show fifty. When a window has an order by and no explicit frame, the default frame is a range up to the current value, and tied rows share it. For a true row by row running total, specify rows between unbounded preceding and the current row. And to make row number deterministic, add a tiebreaker column to the ordering.",
}
