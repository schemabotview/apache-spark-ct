import type { Section } from '../types'

export const checkpoint: Section = {
  id: 'checkpoint',
  title: 'checkpoint(): cutting lineage, not caching it',
  scene: 'mem-checkpoint',
  focus: 'check',
  slide: `## \`checkpoint()\`

A different tool for a different problem.

### \`cache()\` keeps the result **and** the lineage
It has to. If the cache is evicted, the lineage is the only way to get the data back.

So the graph is still there — still hundreds of steps long, still carried by the driver, still replayed on failure.

### \`checkpoint()\` writes to reliable storage and **cuts** it
\`\`\`python
sc.setCheckpointDir("s3://.../ckpt")
df.checkpoint()
\`\`\`
Data goes to durable storage, and the new lineage is **one step**: read this file. Everything before it is discarded.

### When you actually need it
| | |
|---|---|
| **Iterative algorithms** | 200 iterations = a 200-deep graph |
| **Streaming state** | where it isn't optional |

> \`localCheckpoint()\` is faster and not durable — it truncates the lineage but stores to executor disk, so losing an executor loses it *with no way back*.`,
  narration:
    "Checkpoint gets confused with cache constantly, and they solve different problems. Cache keeps the result and the lineage. It has to keep the lineage — because if the cache gets evicted, which we've established happens routinely, the lineage graph is the only way to get the data back. So after caching, the graph is still there. Still hundreds of steps long if your job built hundreds of steps. Still carried around by the driver, still replayed on failure. Checkpoint writes the data to reliable storage — HDFS or S3, somewhere durable — and then cuts the lineage. The new lineage is one step: read this file. Everything before it is discarded, because it's no longer needed; the data is safely somewhere that doesn't depend on being able to recompute it. So when do you need that? Two situations. Iterative algorithms, primarily. If you're running a machine learning loop or a graph algorithm for two hundred iterations, each iteration adds to the lineage graph, and after two hundred you have a graph that's expensive for the driver to hold and catastrophic to replay if anything fails. Checkpointing periodically resets it. The second is streaming state, where checkpointing isn't optional — it's how the engine achieves fault tolerance across restarts. One footnote worth knowing: there's also localCheckpoint, which truncates lineage but writes to executor local storage rather than durable storage. It's faster. But it means if you lose that executor, you've lost the data and the lineage that could have rebuilt it, so the job fails outright. Use it deliberately, not by default.",
}
