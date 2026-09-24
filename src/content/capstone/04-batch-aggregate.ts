import type { Section } from '../types'

export const batchAggregate: Section = {
  id: 'batch-aggregate',
  title: 'Batch layer · Join & aggregate',
  scene: 'cap-aggregate',
  slide: `## Batch · Join & aggregate

Join each event to its product’s **category**, then roll up **revenue per category, per day** — the accurate batch view.

### What’s happening
- Both sides are large, so Catalyst picks a **sort-merge join** (not broadcast)
- \`groupBy … agg\` is a **wide** transformation → a **shuffle** cuts a new stage
- You declare *what* to compute; **Catalyst** plans *how* and **Tungsten** runs it

**Exercises:** sort-merge join · wide transform / shuffle · Catalyst plans, Tungsten runs`,
  narration:
    'Now the heavy lifting: joining and aggregating. Each event only carries a product id, but we want to report by category, so we join our events against a products table to pull in each product’s category. Here’s a detail worth pausing on: in the batch layer both sides of this join are large — a full day of events against the whole product catalog — so Catalyst chooses a sort-merge join, sorting both sides and merging them, which involves shuffling data across the cluster. Keep that in mind, because when we build the speed layer we’ll join the very same products table a completely different way. Once enriched, we roll the data up: group by day and category, and aggregate — summing the amount into revenue and counting distinct users as buyers. That groupBy is what Spark calls a wide transformation, and wide is the word that matters. A narrow transformation like a filter can be computed on each partition independently. A wide one cannot: to total revenue for a category, every row for that category has to end up on the same machine, so the data must be redistributed across the cluster first. That redistribution is the shuffle, and it is also where Spark cuts the job into stages — a stage runs right up to a shuffle, and the next stage cannot start until the previous one’s output has fully landed. So this one groupBy turns our single job into two stages with a shuffle between them. What’s elegant is how little we’ve said about mechanics: we declared what we want — a join and a grouped aggregation — and Catalyst worked out the physical plan, chose the join strategy, and Tungsten compiled it to run fast. That’s the whole promise of the structured APIs, doing real work here. We now have the accurate daily rollup; the last batch step is to write it out.',
}
