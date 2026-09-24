import type { Section } from '../types'

export const theThreshold: Section = {
  id: 'the-threshold',
  title: 'The 10 MB threshold, and what it measures',
  scene: 'joins-threshold',
  focus: 'measures',
  slide: `## The 10 MB threshold, and what it measures

\`spark.sql.autoBroadcastJoinThreshold\` = **10 MB**. Set to \`-1\` to turn broadcasting off entirely.

### The part people get wrong
It is **not** the file size on disk. It's the optimizer's **estimate of the size in memory**.

- 10 MB of Parquet is columnar, dictionary-encoded and compressed
- In memory it's decoded rows, JVM objects and hash-table overhead — often **5–10×** larger
- And if the table has no statistics, the "estimate" is close to a guess

\`\`\`
ANALYZE TABLE customers COMPUTE STATISTICS
\`\`\`
Without that, you're tuning a threshold against a number nobody measured.

### Both failure modes land on the driver
| | |
|---|---|
| **Driver OOM** | you forced \`broadcast()\` on something that wasn't small |
| **\`broadcastTimeout\`** | 300 s to collect and ship it, then the job dies |`,
  narration:
    "So Spark decides to broadcast when it thinks one side is under ten megabytes. That's the autoBroadcastJoinThreshold, and you can raise it, lower it, or set it to minus one to switch broadcasting off completely. But here's the part that trips people up, and it's worth being precise about. That ten megabytes is not the size of the file on disk. It's the optimizer's estimate of how big the table will be in memory. Those are very different numbers. Ten megabytes of Parquet is columnar, dictionary-encoded and compressed — it's about the most compact form that data will ever take. Decode it into JVM row objects and build a hash table over it, and you can easily be looking at fifty or a hundred megabytes of heap. So a table that looks comfortably under the threshold on disk can be well over it in practice. And it gets worse, because that's an estimate. If your table has never had statistics computed, Spark is working from whatever it can infer, and that inference can be badly wrong. Running analyze table compute statistics is the cheapest fix available and almost nobody does it — without it you're tuning a threshold against a number nobody has measured. Now, both ways this fails land on the driver, which is why they hurt. If you force a broadcast on something that isn't actually small, the driver runs out of memory collecting it, and the driver dying kills the whole application. And if the table is large but not quite fatal, you hit the broadcast timeout instead — five minutes to collect and ship it, and then the job fails anyway.",
}
