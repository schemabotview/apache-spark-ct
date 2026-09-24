import type { Section } from '../types'

export const ingest: Section = {
  id: 'ingest',
  title: 'Speed layer · Ingest from Kafka',
  scene: 'cap-ingest',
  slide: `## Speed · Ingest from Kafka

The speed layer is a Structured Streaming job in **four calls**. Stage one reads the clickstream from Kafka as an **unbounded table**.

### What’s happening
- \`readStream\` opens Kafka as a **source** — the input table that never ends
- Each Kafka record → one event row; the JSON \`value\` is parsed into **typed columns**
- Kafka **offsets** are replayable → the job recovers *exactly* after a crash

**Exercises:** streaming source & offsets · the unbounded input table`,
  narration:
    'With the accurate batch view in place, we turn to the speed layer — the real-time half, over on the right, whose whole job is to cover what’s happened since the last batch run. It’s just an ordinary Structured Streaming job, and it’s only four calls long: read the stream, enrich it, aggregate it in windows, and write it out. Those four stages are laid out on the right; we’ll walk them one at a time, and this first one is the ingest. Reading from Kafka is a single call: spark dot readStream, format kafka, subscribe to the clicks topic, and load. The idea underneath that call is the one that makes all of this work, so it’s worth stating plainly. Spark models the stream as an unbounded input table — a table that new rows are appended to forever, with no final row. You write ordinary DataFrame code against it, exactly as if it were a static table, and Spark takes responsibility for re-running that query incrementally as new rows arrive, keeping just enough state between runs to produce the right answer. That’s why nothing in the next three stages will look like special streaming code. Kafka hands us each record with the real payload sitting in a raw value column, so we parse that JSON against a known schema and flatten it out into proper typed columns: the event timestamp, the user id, the product id, and the amount. Two things make Kafka the right source here. Its offsets are replayable, so if the job crashes Spark can rewind to exactly where it left off and lose nothing — that’s the foundation of the exactly-once guarantee we’ll rely on later. And it’s partitioned, so this read scales straight across the executors. The read is tunable too: options like startingOffsets let you replay a topic from the very beginning or pick up only brand-new records, and maxOffsetsPerTrigger caps how much each micro-batch pulls in, so a backlog can’t swamp the job. And Kafka is only one of the streaming sources — the same readStream can just as easily watch a directory of files, or read a socket or the built-in rate source. The source is a swappable option, not a different API. At this point we have a live, typed DataFrame of clickstream events streaming in. The next stage enriches each event with details about the product it refers to.',
}
