import type { Section } from '../types'

export const deliveryGuarantees: Section = {
  id: 'delivery-guarantees',
  title: 'Delivery guarantees: replayable sources, sink behaviour, and foreachBatch idempotency',
  scene: 'delivery-guarantees',
  focus: 'replay-table',
  slide: `## Replay, sinks and idempotency

**Model:** after a failure, Spark **replays** the uncommitted batch with the same \`batchId\` and the same data. The sink decides what a replay does.

### Worked: crash after writing batch 1
- Three batches, **8 distinct orders**; the crash came after the write, before the commit
- Append on every attempt: batch 1 written twice → **11 rows**, 8 distinct
- Overwrite the batch's own place by \`batchId\`: → **8 rows**

### Making foreachBatch safe
- Write to a place or key derived from \`batchId\`, or skip a \`batchId\` already recorded
- Several writes in one function: each needs the same care

### The misconception
"Spark is exactly-once, so my sink is too." Spark gives **at-least-once** execution; an **idempotent** sink turns it into an exactly-once effect.`,
  narration:
    "Here is the case that decides whether a pipeline double counts. After a failure, Spark replays the batch that was planned but not committed. It uses the same batch id and, because the source is replayable, the same input rows. What the replay does to the output depends entirely on the sink. We use for each batch, which hands your function each batch's DataFrame and its batch id. The stream has three batches with eight distinct orders. The query crashes after writing batch one, but before committing it, and is then restarted. The first writer appends every attempt to a Parquet log. Batch one is written twice, and the sink ends with eleven rows, only eight of them distinct. Every downstream total is now wrong. The second writer overwrites the batch's own location, a folder named by the batch id. The replay replaces what the first attempt wrote, and the sink ends with exactly eight rows. That is idempotency: doing it twice has the same effect as doing it once. There are two common ways to get it. Write each batch to a place derived from its batch id, as here, or merge by key. Or record the last batch id you wrote in the target system, and skip a batch already done. If your function writes to several places, each write needs the same care. The misconception to drop is that because Spark is exactly-once, your sink is too. Spark gives at-least-once execution of each batch. Exactly-once effect comes from pairing that with a replayable source and an idempotent sink.",
}
