import type { Section } from '../types'

export const nothingHappensYet: Section = {
  id: 'nothing-happens-yet',
  title: 'Nothing happens yet',
  scene: 'exec-nothing-yet',
  focus: 'happened',
  slide: `## Nothing happens yet

\`\`\`
df = spark.read.parquet("s3://events/")
df = df.filter(col("country") == "IN")
df = df.groupBy("user_id").count()
\`\`\`

No file was opened. No row was tested. **Nothing was counted.** The cluster is idle — it hasn't been told anything.

### What actually happened
A **tree grew on the driver**, in memory. Each call added a node describing an operation. That's all.

### Why wait
You can't optimise a chain you can't yet see the end of.

If Spark ran line 1 immediately, it would read every row of every column — before learning, one line later, that you only wanted India, and only two columns.

> Transformations build a description. Only an **action** turns it into work.`,
  narration:
    "Here's a thing that surprises people the first time they measure it. You write three lines: read a parquet directory, filter it to one country, group by user and count. You run them. They return instantly. And nothing has happened. No file was opened. Not one row was read or tested. Nothing was counted. If you looked at your cluster at this moment, it would be completely idle, because it hasn't been told anything at all. What actually happened is that a tree grew in memory, on the driver. Each call you made added a node to that tree describing an operation — read from here, filter on that, group by this. That's the entire effect of those three lines. This is called lazy evaluation, and it's not a performance trick bolted on afterwards. It's the foundation the optimizer stands on. Here's why. Imagine Spark ran line one the moment you typed it. It would read every row of every column in that directory — possibly billions of rows, two hundred columns — and only then, one line later, would it learn that you wanted just India, and just two columns. All that work, already wasted, and no way to take it back. By waiting, Spark gets to see your whole chain before committing to anything. And once it can see the whole chain, it can rearrange it: push the country filter down into the file reader so those rows are never read at all, and read two columns instead of two hundred. You can't do any of that if you've already started. So the rule is simple: transformations build a description. Only an action turns that description into actual work.",
}
