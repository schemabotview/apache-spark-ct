import type { Section } from '../types'

export const executorResources: Section = {
  id: 'executor-resources',
  title: 'Executor resources, scheduling and dynamic allocation',
  scene: 'executor-resources',
  focus: 'cores-table',
  slide: `## Executors, cores and allocation

### Worked: more cores, same query
- \`local[1]\` → \`local[2]\`: **2.84 s → 1.47 s**, nearly halved
- \`local[2]\` → \`local[4]\`: only **1.33 s** — 4 map tasks of ~1 s each
- A stage ends when its **slowest task** ends

### Resource settings (4.0.1 defaults)
- \`spark.executor.memory\` **1g**, plus overhead: **10%**, at least **384 MiB**
- \`spark.executor.cores\`: tasks run concurrently per executor
- **Dynamic allocation** off by default; with it, idle executors leave after **60 s**, and shuffle tracking keeps those holding shuffle data

### The misconception
"Doubling the cores halves the runtime." Only while there are **enough tasks** to use them.`,
  narration:
    "Resources come in executors, each with some cores and some memory. To see how cores translate into speed, we ran the baseline query with one, two and four local cores, five times each. One core took two point eight four seconds. Two cores took one point four seven, almost exactly half. Four cores took one point three three, barely better. The stage metrics explain why. With four cores, the scan ran as four tasks of about a second each, and a stage cannot finish before its slowest task. There was simply not enough independent work to use the extra cores well. On a cluster, the same reasoning applies at scale. Spark executor memory defaults to one gigabyte, and on top of that every executor needs memory overhead outside the JVM heap, ten percent by default with a minimum of three hundred and eighty four mebibytes. Spark executor cores decides how many tasks run concurrently in each executor. Dynamic allocation, off by default, lets Spark add executors when tasks are waiting and remove them when they have been idle, sixty seconds by default. With shuffle tracking, which is on by default, Spark keeps executors that still hold shuffle data that later stages need. So the misconception is that doubling the cores halves the runtime. That only holds while there are enough tasks to keep every core busy, and while no single task dominates its stage.",
}
