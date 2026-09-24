import type { Section } from '../types'

export const enrich: Section = {
  id: 'enrich',
  title: 'Speed layer · Enrich with a broadcast join',
  scene: 'cap-enrich',
  slide: `## Speed · Enrich with a broadcast join

Each event carries only a \`product_id\` — join the small **product dimension** to get its category, using a **broadcast join**.

### What’s happening
- The product dim is **small**, so \`broadcast\` ships a copy to **every executor**
- Each event is enriched **locally** — **no shuffle**, unlike the batch sort-merge join
- It’s the *same* DataFrame \`join\` API as batch — it just runs on the stream

**Exercises:** broadcast-hash join · joins on streams · the same API, a different plan`,
  narration:
    'The second speed stage enriches each streaming event with its product’s category — and this is the moment I asked you to remember from the batch layer. We’re joining against the very same products table, but here we do it a completely different way: a broadcast join. The reason is the shape of the data. In the batch layer both sides were huge, so a shuffle-heavy sort-merge join made sense. But in the speed layer, one side — the product dimension — is small enough to fit in memory, so we wrap it in broadcast, and Spark ships a full copy of that little table out to every executor. Now each executor can enrich its stream of events entirely locally, matching each product id against its in-memory copy, with no shuffle at all. That’s a big deal for streaming, where every shuffle adds latency you can’t afford. Two things are worth taking away. First, broadcast joins are the single most important join optimization in Spark: whenever one side is small, broadcasting it avoids the expensive shuffle. Second — and this is the thread running through the whole capstone — it is the exact same DataFrame join API we used in batch. We didn’t learn a new streaming join; we wrote the same code, and the engine ran it continuously over the unbounded table. With each event now carrying its category, we can aggregate.',
}
