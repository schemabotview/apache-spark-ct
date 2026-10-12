import type { Section } from '../types'

export const workedEdgeCases: Section = {
  id: 'worked-edge-cases',
  title: 'Worked case: edge cases, duplicates and invariants',
  scene: 'edge-case-pipeline',
  focus: 'edge-invariants',
  slide: `## Worked case: nine messy events

### What the stream contains
- A **truncated** line, an exact **duplicate** (o4 resent), an **update** (o2 PENDING → COMPLETED)
- o8 **without an amount**; o7 at **store 15**, absent from \`stores\`
- o4 at **23:30 UTC** — 2 October in London

### Trace the safe pipeline
1. Quarantine **1**; parse **8**
2. Keep the latest event per order: **6** orders
3. Completed **with** an amount: **5**, worth **190.00**
4. Left join keeps o7 with **city NULL**, flagged; daily totals in **Europe/London**

### The misconception
"Sum the completed rows." The naive total is **7 rows, 205.00** — o4 counted twice, and o8 counted although it had no amount to count.`,
  narration:
    "Let's put the chapter together on one stream of nine order events, each hiding a problem we have met. One line is truncated. Order four was sent twice, identically. Order two arrived as pending and was later updated to completed. Order eight is completed but has no amount. Order seven belongs to store fifteen, which is missing from the store table. And order four happened at eleven thirty at night, universal time. Start with the naive answer: filter to completed rows and sum them. That gives seven rows and two hundred and five, and it is wrong. Order four is counted twice, and order eight is counted as an order even though there is nothing to add. Now trace the safe pipeline. Parsing with a corrupt record column quarantines one line and parses eight. A row number over each order, newest event first, keeps one event per order, which leaves six orders. The duplicate collapses, and order two keeps its completed version. Keeping completed orders that actually have an amount leaves five, worth one hundred and ninety, and order eight is flagged rather than silently counted. A left join keeps order seven with a null city, so it can be flagged rather than lost. And with the session in London, order four lands on the second of October. Every one of those numbers is an invariant you can check on each run. Next, we look under the hood, at how Spark turns this code into query plans.",
}
