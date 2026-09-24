import type { Section } from '../types'

export const clean: Section = {
  id: 'clean',
  title: 'Batch layer · Clean & prepare',
  scene: 'cap-clean',
  slide: `## Batch · Clean & prepare

Raw events are messy — the batch layer removes **replays** and derives the columns the rollup will need.

### What’s happening
- \`dropDuplicates\` removes **replayed** rows — the source can deliver the same event twice
- \`withColumn\` derives clean, typed fields — a real \`ts\`, a \`day\` bucket to group by
- These are all **lazy transformations** — they just extend the plan; nothing runs yet

**Exercises:** DataFrame operations · lazy transformations · dedup`,
  narration:
    'With the raw events in hand, the next stage cleans them up, because real data is never tidy. The first problem is duplicates. Upstream systems, and Spark’s own recovery, both work on at-least-once delivery, which means the exact same event can show up more than once — so we call dropDuplicates on a unique event id to collapse those replays down to one. Then we shape the data into what the rollup needs: we parse the raw timestamp into a proper timestamp type, and we derive a day column from it that we’ll group by later. And we drop any nonsense rows, like non-positive amounts. Now the thing worth stopping on: not one of these operations has actually run yet. Spark splits every call you can make into two kinds. Transformations — dropDuplicates, withColumn, filter, select, join, groupBy — are lazy: each one just adds another node to a logical plan and returns immediately, without touching a row. Actions — count, collect, show, write — are what force the plan to execute. Nothing here is an action, so nothing here has executed. That laziness is not an implementation quirk, it is the whole reason the optimizer can do its job: because Spark holds the entire chain before it runs any of it, Catalyst can see all four of our calls at once and rewrite them — folding this filter together with the pushdown from the read, so the two become a single scan rather than a scan followed by a pass. If each call had run eagerly, that rewrite would be impossible. So at this point we’ve described a clean, deduplicated, well-typed dataset, without having computed anything. Next we join in product details and aggregate.',
}
