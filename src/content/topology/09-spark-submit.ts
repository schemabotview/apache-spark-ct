import type { Section } from '../types'

export const sparkSubmitSection: Section = {
  id: 'spark-submit',
  title: 'What spark-submit actually does',
  scene: 'topology-spark-submit',
  focus: 'code',
  slide: `## What \`spark-submit\` actually does

Every flag decides one thing from this course.

| Flag | Decides |
|---|---|
| \`--master\` | which cluster manager |
| \`--deploy-mode\` | where the driver lands |
| \`--driver-memory\` | how much the coordinator gets |
| \`--executor-memory\` / \`--executor-cores\` | the shape of each worker JVM |
| \`--num-executors\` | how many of them |

### Read the resource flags as one number
\`\`\`
executors × cores = the slots your job can ever use
\`\`\`
20 × 5 = 100 slots. 400 shuffle partitions over 100 slots = **4 clean waves**. 401 partitions = **5 waves**, the last one 1% busy.

### The ordering trap
\`\`\`
spark-submit --conf k=v app.py --date 2026-09-24
\`\`\`
\`--conf\` **before** the app file is Spark configuration. **After** it, it's an argument to *your program*.

A misplaced flag is **silently ignored**, not rejected. It's a common reason a setting "doesn't work".`,
  narration:
    "Spark-submit is the command that launches everything, and it's worth reading as a summary of this whole course, because every flag decides one thing we've discussed. Master picks the cluster manager. Deploy-mode decides where the driver lands. Driver-memory sizes the coordinator — and remember, it only plans, unless you collect, which is exactly the trap. Executor-memory and executor-cores shape each worker JVM. Num-executors says how many. Here's the useful way to read the resource flags: as one number. Executors times cores is the total number of task slots your job can ever use. Twenty executors with five cores is a hundred slots. Now line that up with your shuffle partitions. Four hundred partitions over a hundred slots is four clean waves, with every slot busy in every wave. Four hundred and one partitions is five waves, and the last one runs a single task while ninety-nine slots sit idle. That arithmetic is worth doing before you tune anything else, because it's free and it's frequently the whole problem. And one trap that costs people real time. Arguments before the application file are Spark's. Arguments after it belong to your program. So a --conf placed after app dot py is not a Spark setting at all — it's a command-line argument being handed to your Python script, which almost certainly ignores it. The failure mode is the worst kind: no error, no warning, and a configuration that simply never took effect. If a setting seems to do nothing, check which side of the file name it's on.",
}
