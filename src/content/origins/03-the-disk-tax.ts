import type { Section } from '../types'

export const theDiskTax: Section = {
  id: 'the-disk-tax',
  title: 'The disk round-trip that Spark exists to remove',
  scene: 'origins-disk-tax',
  focus: 'chain',
  slide: `## The disk round-trip

MapReduce's model is rigid: **map, then reduce.** One pass. Any real algorithm is many passes chained together.

### What happens between the passes
Every step **writes its entire output to HDFS** — to disk, then replicated across the network for durability — and the next step **reads it all back**.

\`\`\`
step 1 → [write ×3, read back]
       → step 2 → [write ×3, read back]
       → step 3
\`\`\`

A three-step job pays that twice. A hundred-step job pays it ninety-nine times.

### Who this hurts most
| | |
|---|---|
| **Machine learning** | the same data, 100 iterations |
| **Graph algorithms** | PageRank, until it converges |
| **Interactive queries** | a full re-read for every question you ask |

Anything whose steps are a **loop** rather than a line. Which is most of the interesting ones.

> Spark's entire origin is: *what if that round-trip didn't have to happen?*`,
  narration:
    "Hadoop MapReduce worked, and at the time it was a genuine breakthrough. But it had one characteristic that turned out to matter enormously, and understanding it is understanding why Spark exists. MapReduce gives you a rigid shape: a map phase, then a reduce phase. That's one pass. Real algorithms are almost never one pass — they're many passes chained together. So you write step one as a MapReduce job, step two as another, step three as another. And here's the cost. Between every pair of steps, the output of the first is written to HDFS in full. Not to memory — to disk. And because HDFS is designed for durability, it's replicated, typically three times, which means it also crosses the network. Then the next step starts by reading all of that back off disk again. A three-step job pays that round-trip twice. A hundred-step job pays it ninety-nine times. Now think about which algorithms that punishes. Machine learning: you make a hundred passes over the same data, refining parameters each time. Every single pass reads the whole dataset from disk again, even though it's identical data. Graph algorithms like PageRank iterate until they converge — same problem. Interactive analysis is worse still: you ask a question, wait, look at the answer, ask a follow-up, and Spark's predecessors re-read the entire dataset from scratch for every question. The pattern is that anything whose steps form a loop rather than a straight line pays this over and over. And loops are where the interesting work is. So the question that started Spark was simply: what if that round-trip didn't have to happen?",
}
