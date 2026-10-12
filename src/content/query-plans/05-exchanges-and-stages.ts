import type { Section } from '../types'

export const exchangesAndStages: Section = {
  id: 'exchanges-and-stages',
  title: 'Exchanges, shuffle mechanics and stage boundaries',
  scene: 'exchange-stages',
  focus: 'shuffle-write',
  slide: `## Exchanges and stage boundaries

An \`Exchange\` is where data **moves between tasks** — and where one stage ends.

### Three kinds in these plans
- \`Exchange hashpartitioning(city, 200)\`: rows routed **by key** — a shuffle
- \`rangepartitioning(sales DESC, 200)\`: from \`orderBy\`, for a global sort
- \`BroadcastExchange\`: the small side copied to **every** task

### Shuffle mechanics
- **Map side:** each task writes its output partitioned by target, to local disk
- **Reduce side:** each task fetches its partition from every map output
- Worked: 1,000,000 rows in → partial sums → **200** shuffle records, 17,239 bytes

### The misconception
"\`200\` in the plan means 200 tasks ran." AQE read the shuffle as **1** coalesced partition.`,
  narration:
    "Exchanges are where you should look first in any plan, because they are where data moves between tasks, and where one stage ends and the next begins. This query has two kinds. The broadcast exchange collects the fifty stores and copies them to every task. It even ran as a job of its own. The hash partitioning exchange routes rows by city so that every city's partial results meet in one place. That is the shuffle. A third kind appeared in the first version of this query, which ended with an order by: a range partitioning exchange, which splits rows into sorted ranges so the output can be globally ordered. Now the mechanics behind a shuffle, as the Spark guide describes them. On the map side, each task writes its output to local disk, organised by the partition each row is headed for. On the reduce side, each task fetches its own partition from every map task's output. Put numbers on it. The map side read one million orders, joined and partially aggregated them, and wrote just two hundred records, fifty cities from each of four tasks, seventeen thousand bytes in total. That is the partial aggregation from chapter two, measured. One misconception to drop. The plan says two hundred partitions, but two hundred tasks did not run. Adaptive execution saw how little data there was and read the whole shuffle as a single coalesced partition, in one task.",
}
