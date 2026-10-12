import type { Section } from '../types'

export const streamingArchitecture: Section = {
  id: 'streaming-architecture',
  title: 'Structured Streaming architecture and execution model',
  scene: 'streaming-engine',
  focus: 'microbatch-steps',
  slide: `## The micro-batch engine

**Model:** a streaming query is a loop of small batch jobs, each planned from the offsets that are new since the last one.

### One micro-batch, in order
1. **Plan offsets** — ask each source what is new
2. **Write ahead** — save those offsets to the checkpoint first
3. **Run** the incremental plan on the new rows only
4. **Update state** and **write the sink** per output mode
5. **Commit** — the batch is marked done

### Reading progress
- \`query.lastProgress\`: input rows and time per phase
- The watermark, state rows, and each source's offsets

### The misconception
"Streaming is a separate engine." Each micro-batch is planned and run by the **same** optimizer and executors as a batch query.`,
  narration:
    "How does Spark actually run a streaming query? By default it runs a loop of small batch jobs, called micro-batches. Each one goes through the same steps, in the same order. First, the engine asks every source what is new since the last batch, and fixes that range as offsets. Second, before doing any work, it writes those offsets ahead into the checkpoint, so a crash cannot lose track of what this batch was meant to read. Third, it runs the incremental plan on just the new rows. Fourth, it updates the state store, the running totals from the previous section, and writes the result to the sink according to the output mode. Finally, it commits: a record that this batch is finished. Planned, then committed. That pair of records is what makes recovery possible, as we will see in the checkpoint section. You do not have to take this on trust. Every query publishes a progress report, readable as last progress. It shows the batch id, the number of input rows, how long each phase took, the current watermark, the number of rows held in state, and the start and end offsets each source contributed. When a stream falls behind or its state grows, this report is the first place to look. The misconception here is that streaming is a separate engine. It is not. Each micro-batch is an ordinary query, planned by the same optimizer and run by the same executors you met in the earlier chapters.",
}
