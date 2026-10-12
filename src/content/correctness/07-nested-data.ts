import type { Section } from '../types'

export const nestedData: Section = {
  id: 'nested-data',
  title: 'Arrays, maps, structs and nested-data transformations',
  scene: 'nested-data',
  focus: 'explode-join-trap',
  slide: `## Arrays, maps and structs

### Reaching inside
- Struct field: \`items.sku\` → **[TEA, MUG]** for o1
- Map lookup: \`attrs["channel"]\` → **web**; a missing key gives **NULL**
- \`size(items)\`: 2, 1, **0** for o4, **NULL** for o5

### Exploding changes the row count
- \`explode\`: **3** rows — o4 (empty) and o5 (NULL) **vanish**
- \`explode_outer\`: **5** rows, keeping both with NULLs
- Line totals: 10.00 + 30.00 for o1, 25.00 for o2

### The misconception
"Explode, then join the order total." Each order-level amount repeats per line: **105.0** instead of **65.0**.

**Rule:** aggregate to one grain **before** joining data at another.`,
  narration:
    "Order events rarely arrive flat. Here each order carries an array of line items, each item a struct with a sku, a quantity and a price, plus a map of attributes such as the sales channel. Reaching inside is straightforward. Items dot sku returns the array of skus, so order one gives tea and mug. The attributes map is read by key, so channel is web for order one. Ask for a key that is not there, such as promo on order two, and you get null rather than an error. Size counts the items: two for order one, one for order two, zero for order four, whose array is empty, and null for order five, whose array is missing altogether. To work with line items, you usually explode the array into one row per item, and this is where row counts change. Explode returned three rows, two from order one and one from order two. Orders four and five vanished completely, because an empty or missing array produces no rows. Explode outer keeps them, with nulls, and returns five. The line totals add up correctly: forty for order one, twenty five for order two. Now the misconception. Suppose you explode first and then join an order level amount back on. Order one has two lines, so its forty dollar amount appears twice. The sum comes out at one hundred and five instead of sixty five. Aggregate at one grain before joining at another.",
}
