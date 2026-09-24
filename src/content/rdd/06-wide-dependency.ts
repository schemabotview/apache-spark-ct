import type { Section } from '../types'

export const wideDependency: Section = {
  id: 'wide-dependency',
  title: 'Wide dependencies, and everything they take back',
  scene: 'rdd-wide',
  focus: 'costs',
  slide: `## Wide dependencies

**An output partition needs rows from many inputs.**

\`groupByKey\` · \`join\` · \`distinct\` · \`sortBy\`

To collect every row for user 42, you need every input partition — any of them could hold one.

### Everything narrow gave you, taken back
| | |
|---|---|
| **Pipelining ends** | this is a **stage boundary** |
| **The network** | written to local disk, then fetched |
| **Recovery is costly** | one partition now depends on **many** |

### The number that is the cost of your job
\`df.explain()\` → **count the Exchanges.** Each one is a stage boundary, a disk write, a network fetch, and a barrier.

> \`reduceByKey\` combines *within* each partition first. \`groupByKey\` sends every row. Same answer.`,
  narration:
    "The other kind of dependency is wide, and this is where the money goes. A wide dependency means an output partition needs rows from many input partitions. GroupByKey, reduceByKey, join, distinct, sortBy — all wide. Think about why that's forced. To collect every row belonging to user forty-two into one place, you need to look at every input partition, because any of them might hold one of those rows. There's no way to know in advance which ones do. Now, everything narrow gave us gets taken back, all three at once. Pipelining ends — this is a stage boundary, and the fusion of operations stops right here. The network gets involved: output is written to local disk and then fetched across the cluster. And recovery becomes expensive, which is the part people miss. Under a narrow dependency, losing one partition means recomputing one parent. Under a wide dependency, the lost partition depended on every upstream partition, so recovery can cascade into recomputing a great deal. Here's the practical consequence, and it's the most useful diagnostic in Spark. Run explain on your DataFrame and count the Exchanges. Each Exchange is one wide dependency — one stage boundary, one disk write, one network fetch, and one barrier where everything waits for the slowest task. That count is essentially the cost of your job. One last thing worth knowing: not all wide operations are equal. ReduceByKey combines values within each partition before sending anything, so if you're summing a million rows down to a hundred keys, only a hundred values per partition cross the network. GroupByKey sends every single row and combines afterwards. Identical answer. Wildly different cost.",
}
