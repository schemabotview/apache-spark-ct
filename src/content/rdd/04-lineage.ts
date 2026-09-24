import type { Section } from '../types'

export const lineage: Section = {
  id: 'lineage',
  title: 'Lineage: the plan is the backup',
  scene: 'rdd-lineage',
  focus: 'recover',
  slide: `## Lineage: the plan is the backup

Every RDD knows its parents. Follow those links back and you reach something **durable on disk**. That graph costs a few kilobytes on the driver.

### When a machine dies
1. Partition 2 is lost. **No replica exists** — and none is needed.
2. Spark reads the graph **backwards**: which parents fed it?
3. It recomputes **that path, for that one partition**

Not the RDD. Not the stage. Not the job.

| | |
|---|---|
| **MapReduce** | keeps the *data* safe — replicate always |
| **Spark** | keeps the *recipe* safe — free until needed |

### The cost nobody mentions
A graph hundreds of steps deep makes recovery expensive. That's what \`checkpoint()\` is for: write to durable storage and **cut the chain**.`,
  narration:
    "This is the idea that makes Spark's fault tolerance different from everything before it. Every RDD knows its parents. Follow those links backwards and you get a graph — a chain of operations reaching all the way back to something durable on disk, like a file. That graph is called the lineage, and it's built up on the driver as you write your transformations. It costs a few kilobytes of memory. Now watch what that buys. A machine dies mid-job, taking partition two with it. There's no replica of partition two anywhere. Under the old model that's a catastrophe, which is why MapReduce replicated everything three times. Under Spark, it's a lookup. Spark reads the lineage graph backwards and asks: which parent partitions fed partition two? It recomputes that path, for that one partition, and the job continues. Notice the precision there. It doesn't rebuild the RDD. It doesn't rerun the stage. It rebuilds exactly what was lost. The job gets slower by the cost of one partition, and nothing fails. So the contrast is: MapReduce kept the data safe by replicating it, and paid that cost on every write whether anything failed or not. Spark keeps the recipe safe, and remaking a recipe costs nothing until you actually need it. Now let me give you the cost nobody mentions, because it's real. If your lineage graph is hundreds of steps deep — which happens in iterative algorithms, a machine learning loop that runs two hundred iterations — then recovering one partition means replaying two hundred steps, and the graph itself becomes slow for the driver to handle. That is what checkpoint is for. Checkpoint writes an RDD to durable storage and cuts the lineage chain at that point. You're trading disk for a shorter graph, and it's the one situation where caching isn't the right answer.",
}
