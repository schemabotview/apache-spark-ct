import type { Section } from '../types'

export const caching: Section = {
  id: 'caching',
  title: 'Evaluate caching, persistence and recomputation',
  scene: 'cache-tradeoff',
  focus: 'cache-table',
  slide: `## Caching versus recomputation

Without a cache, every action **recomputes** its plan from the source.

### Worked: two aggregations over the same data
- Recompute both times: **2.12 s**
- Cache: materialise **2.25 s**, then both actions **1.39 s** — 3.64 s in total
- Each reuse saves 0.73 s, so the cache pays off only after about **3 rounds**

### What a cache is
- \`cache()\` is **lazy**: nothing is stored until an action runs
- Default level \`MEMORY_AND_DISK_DESER\`; here **89 MB** in memory, 4 partitions
- The plan reads it via \`InMemoryTableScan\`

### The misconception
"Caching always speeds things up." Used once or twice, it made this job **slower**.`,
  narration:
    "Every action recomputes its plan from the source unless you cache an intermediate result. That makes caching look like an easy win, so let's measure it. We built an enriched dataset, completed orders joined to stores, and ran two aggregations over it, one by city and one by day. Recomputing the enriched data for each aggregation took two point one two seconds in total. Then we cached it. Caching is lazy, so the first count is what actually builds the cache, and it took two point two five seconds on its own. After that, both aggregations together took one point three nine seconds. Add it up. The cached version cost three point six four seconds, against two point one two without it. Caching saved about seven tenths of a second each time the pair of aggregations ran, so it only pays off after roughly three rounds of reuse. The cached data used the default storage level, memory and disk, deserialized, and occupied eighty nine megabytes of memory across four partitions. In the plan, a cached DataFrame appears as an in memory table scan, which is how you confirm that a query actually used it. Remember to unpersist it when you are done, because cached blocks hold storage memory until they are released. So the misconception is that caching always speeds a job up. Used once or twice, this cache made the job slower. Cache what you reuse often, and measure it.",
}
