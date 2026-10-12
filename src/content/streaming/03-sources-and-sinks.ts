import type { Section } from '../types'

export const sourcesAndSinks: Section = {
  id: 'sources-and-sinks',
  title: 'Sources, sinks, and input/output contracts',
  scene: 'sources-sinks',
  focus: 'source-table',
  slide: `## Sources, sinks and their contracts

**Objective:** know what each end of a query promises, because recovery depends on both.

### The input contract
- A source must **replay** from a recorded offset: file log index, Kafka partition offsets
- Socket cannot replay — testing only

### The output contract
- **File sink:** exactly-once, append mode only
- **Kafka, foreach:** at-least-once — a retry can write twice
- **foreachBatch:** whatever your function guarantees
- **Console, memory:** debugging, no guarantee

**Retail stream:** JSON files in, Parquet out — a restart rereads a batch without duplicating output.

### The misconception
"Exactly-once is a property of Spark." It is a property of **source + checkpoint + sink** together.`,
  narration:
    "Every streaming query has two ends, and each end carries a contract. Start with the input. For a query to survive a failure, its source must be able to replay data from a recorded offset. The file source records an index in its own log of which files it has read. Kafka records an offset for each partition. The rate source, used for testing, counts what it generated. The socket source keeps nothing, so if the query fails, the data it already received is gone. It is for experiments only. Now the output. The file sink is exactly-once, because it records which batch wrote which files, and a replayed batch replaces rather than adds. It supports append mode only. Kafka and the foreach sink are at-least-once: if a batch is retried, the same rows can be written again. For each batch hands you a DataFrame and a batch id, and its guarantee is whatever your function provides, which is the subject of section twelve. Console and memory sinks are for debugging and promise nothing. In the retail stream, JSON order files come in and Parquet files go out. Both ends hold up their side, so after a crash Spark can reread the last batch without duplicating anything in the output. The misconception to drop is that exactly-once is something Spark does by itself. It is the combination of a replayable source, a checkpoint that records offsets, and a sink that tolerates replay. Weaken any one of the three and the guarantee is gone.",
}
