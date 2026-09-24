import type { Section } from '../types'

export const whyAShuffle: Section = {
  id: 'why-a-shuffle',
  title: 'Why a shuffle has to happen',
  scene: 'shuffle-dependencies',
  focus: 'wide',
  slide: `## Why a shuffle has to happen

A Spark job is fast right up until an operation needs a row it doesn't have. That moment has a name.

### Narrow — every output partition reads exactly one input
- \`filter\` · \`map\` · \`select\` · \`withColumn\` · \`union\`
- The work happens **where the data already is**. No network.
- Chained narrow steps collapse into **one pass** over the rows

### Wide — an output partition needs rows from many inputs
- \`groupBy\` · \`join\` · \`distinct\` · \`orderBy\` · \`reduceByKey\`
- To count every event for user 42, **all of user 42's rows must meet**
- They start out scattered across every machine in the cluster

### The shuffle is the meeting
- Not an operation Spark *chooses* — the **only** way to satisfy a wide dependency
- Everything expensive about it follows from that one requirement`,
  narration:
    "Here is the one distinction the whole of Spark performance rests on, and it takes about a minute to see. Picture a table split into four partitions, each sitting on a different machine. Now apply a filter. Each machine looks at its own rows, throws away the ones that don't match, and keeps the rest. Four machines, working at the same time, never talking to each other. That's called a narrow dependency — every output partition was built from exactly one input partition. Spark loves these, because it can chain a whole run of them together and do them all in a single pass over the rows, without ever writing anything down in between. Now change one word. Instead of filtering, group by user id, and count. Think about what that actually requires. To produce the count for user forty-two, you need every single row belonging to user forty-two — and those rows are scattered across all four machines, because nothing ever arranged them by user. There is no clever way around this. Before that count can be computed, the rows have to be brought together. That's a wide dependency, and the process of bringing them together is the shuffle. So the shuffle isn't something Spark does because it's poorly written, or a setting somebody left wrong. It's the only possible answer to a question you asked. What the rest of this course is about is what that answer costs — and it costs a lot, because it means writing to disk, crossing the network, and stopping the whole job at a hard line while it happens.",
}
