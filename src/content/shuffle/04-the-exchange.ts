import type { Section } from '../types'

export const theExchange: Section = {
  id: 'the-exchange',
  title: 'Who owns the shuffle files',
  scene: 'shuffle-exchange',
  focus: 'ess',
  slide: `## Who owns the shuffle files

They're written by an executor — but they **outlive** it. That one fact explains three otherwise unrelated behaviours.

### Shuffle persistence
- Output stays on disk after the stage ends
- Re-run a job over already-shuffled data → the map stages show **"skipped"**
- That's not a bug, and it isn't your \`cache()\` working. It's this.

### The external shuffle service
- A long-lived process **per node**, outside any executor JVM
- \`spark.shuffle.service.enabled\` — serves shuffle files when the writer is gone
- **Required** for dynamic allocation to be safe: without it, releasing an idle executor destroys shuffle output that the reduce side still needs

### The fan-out nobody mentions
\`\`\`
400 map tasks × 200 reduce tasks = 80,000 fetch requests
\`\`\`
The shuffle's cost isn't only bytes — it's **connections**.`,
  narration:
    "So the map side has written its files and stopped. Those files are sitting on local disks all over the cluster, and now we have to ask an awkward ownership question: who do they belong to? The instinct is to say the executor that wrote them. But they outlive it, and that single fact explains three behaviours that otherwise look unrelated. The first is shuffle persistence. Shuffle output stays on disk after its stage ends. So if you run a second job over data you've already shuffled, Spark notices the files are still there and skips the map stages entirely — you'll literally see stages marked skipped in the UI. People often think that's their cache working. It isn't. It's this. The second is the external shuffle service. That's a separate long-lived process running on each node, outside any executor's JVM, whose only job is to serve shuffle files. And you need it the moment you turn on dynamic allocation, because dynamic allocation gives idle executors back to the cluster — and if the executor that wrote your shuffle files is gone, and nothing else can serve them, the reduce side has nothing to fetch and the stage has to be recomputed from scratch. With the service running, the executor can die and the files still answer. Spot instances, autoscaling, Kubernetes evictions — all of them depend on this. And the third thing is the fan-out. Every reduce task needs its slice from every map task. Four hundred map tasks and two hundred reducers is eighty thousand separate fetch requests. The cost of a shuffle isn't only the bytes you move. It's the number of connections you open to move them.",
}
