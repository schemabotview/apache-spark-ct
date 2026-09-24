import type { Section } from '../types'

export const theTimeline: Section = {
  id: 'the-timeline',
  title: 'Three eras, and which one you start in',
  scene: 'origins-timeline',
  focus: 'adaptive',
  slide: `## Three eras, and which one you start in

The dates matter only for what each one **changed about who decides the plan.**

### The RDD era — 2009 → 2014
You wrote the plan yourself: \`map\`, \`filter\`, \`reduceByKey\`. Spark ran **exactly that**, in that order. Fast code was your job.

### The structured era — 2016, Spark 2.0
**DataFrames.** You describe the *result*; an optimizer picks the plan. That's why a DataFrame usually beats the RDD code you'd have hand-written.

### The adaptive era — 2020 → now
**3.0** brought adaptive execution; **3.2** made it the default. The plan stops being fixed before the job starts — Spark measures each shuffle and **re-plans mid-flight**.

> One idea repeating: *stop writing the plan → stop fixing the plan.* Much of the advice online was written in an earlier era and quietly no longer applies.`,
  narration:
    "Let's close by putting the history in order, because the dates only matter for what each one changed about who decides the plan. The first era is the RDD era, running from the 2009 research project, through the donation to Apache in 2013 and the founding of Databricks, to Spark 1.0 in 2014. In that era you wrote the plan yourself. You called map, then filter, then reduceByKey, and Spark executed exactly that, in exactly that order. If your order was inefficient, you got an inefficient job. Writing fast Spark was a skill, and it involved knowing a lot about the engine. The second era arrives in 2016 with Spark 2.0 and the structured APIs — DataFrames. And this is a genuine change in kind, not degree. Instead of specifying the operations, you describe the result you want, and an optimizer decides how to get it. The power moved from you to the engine. That's why, today, a DataFrame query is usually faster than the RDD code you would have hand-written: the optimizer is better at this than you are, and it never gets tired. The third era starts with Spark 3.0 in 2020 and becomes the default in 3.2. Adaptive query execution. Here the plan stops being fixed before the job even starts. Spark runs part of the job, measures what actually happened — real row counts, real partition sizes — and re-plans the rest with facts instead of estimates. So the whole arc is one idea repeating: first you stopped writing the plan, then you stopped fixing the plan. You're starting at the end of that arc, which is the easy place to start and, honestly, the confusing place to understand — because a great deal of the advice you'll find online was written in an earlier era and quietly no longer applies.",
}
