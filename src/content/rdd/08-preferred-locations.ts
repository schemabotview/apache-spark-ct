import type { Section } from '../types'

export const preferredLocations: Section = {
  id: 'preferred-locations',
  title: 'Data locality, and why tasks wait',
  scene: 'rdd-locality',
  focus: 'levels',
  slide: `## Data locality

The scheduler asks each partition **where it would rather run** — because moving a task is free and moving a partition is not.

| | |
|---|---|
| \`PROCESS_LOCAL\` | same JVM — **already cached** here |
| \`NODE_LOCAL\` | same machine — local disk read |
| \`RACK_LOCAL\` | same rack — short network hop |
| \`ANY\` | anywhere. Ship the data. |

### The behaviour that confuses people
If the ideal slot is busy, Spark **waits** rather than settling — \`spark.locality.wait\`, 3 s.

So a stage can show **idle slots** while tasks queue. It isn't stuck; it's betting 3 seconds beats moving a gigabyte.

> On cloud object storage \`NODE_LOCAL\` is often meaningless — this matters far less than it did on HDFS.`,
  narration:
    "The fifth property is preferred locations, and it's the one that explains a Spark UI behaviour people find baffling. When the scheduler is deciding where to run a task, it asks that task's partition where it would rather be computed. The reasoning is simple: a task is kilobytes of serialised code, and a partition is maybe a hundred megabytes of data. Moving the task is free. Moving the data is not. So send the task to the data. There's a hierarchy of how good a placement can be. Process-local is best: the partition is already cached in this very JVM, so there's no I/O at all. Node-local means the same machine but a different process — a local disk read, still fast. Rack-local means over the network but a short hop within the same rack. And ANY means anywhere at all: ship the data to wherever there's a free slot. Now here's the behaviour that confuses people. If the ideal slot is busy, Spark doesn't immediately settle for a worse one. It waits. There's a setting called spark dot locality dot wait, three seconds by default, and during that window Spark holds out hoping the good slot frees up. Which means you can look at the Stages tab and see idle executors while tasks are queued, and conclude something is broken. Nothing is broken. Spark is making a bet that waiting three seconds is cheaper than moving a gigabyte across the network. Usually it's right. The place to read this is the Locality Level column in the Stages tab. If everything says ANY, every task is pulling its input over the wire and locality has failed. One honest caveat: on cloud object storage, node-local is often meaningless, because compute and storage are genuinely separate services. So this matters far less today than it did when everyone ran HDFS on the same machines as their compute.",
}
