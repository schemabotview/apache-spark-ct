import type { Section } from '../types'

export const boundedVsUnbounded: Section = {
  id: 'bounded-vs-unbounded',
  title: 'Bounded versus unbounded data and incremental computation',
  scene: 'incremental-query',
  focus: 'incremental-table',
  slide: `## Bounded and unbounded data

**Objective:** treat a stream as a table that keeps growing.

### The model
- **Bounded:** a fixed input — the query runs once and ends
- **Unbounded:** new rows keep arriving — the query is **incremental**
- Same DataFrame code: \`readStream\` / \`writeStream\` instead of \`read\` / \`write\`

### Worked: four files, four micro-batches
- Each batch read **only the new rows**: 3, 3, 2, 2
- The result stayed **cumulative**: store 7 went 65 → 90 → 130
- Final: **7 → 130, 9 → 80, 12 → 100** — the same as a batch query over all ten rows

### The misconception
"Each micro-batch recomputes everything from the start." Spark keeps running totals in **state**, so batch 3 read two rows, not ten.`,
  narration:
    "This chapter moves from data that has an end to data that never stops arriving. A bounded input, like yesterday's order files, is fixed: the query reads it, runs once, and finishes. An unbounded input keeps growing, so the useful question changes from what is the answer to how does the answer change as rows arrive. Structured Streaming's model is to treat the stream as a table that keeps getting new rows appended, and to run your query against it incrementally. The code barely changes. You read with read stream instead of read, and write with write stream, giving a checkpoint location. Here the retail order events arrive as four small JSON files, one per micro-batch, and the query sums sales by store. Look at the second column: each batch read only its new rows, three, three, two and two. Yet the result is cumulative. Store seven goes from sixty five, to ninety, to one hundred and thirty, as its orders arrive. After the fourth file, the totals are one hundred and thirty, eighty and one hundred, exactly what a batch query over all ten rows returns. That equality is the contract: a streaming query should give the same answer as the batch query over the data seen so far. The misconception to drop is that each micro-batch recomputes everything from the beginning. It does not. Spark keeps the running totals in state between batches, so the last batch read two rows, not ten. That state is what the rest of this chapter is about.",
}
