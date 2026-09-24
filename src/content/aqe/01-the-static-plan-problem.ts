import type { Section } from '../types'

export const staticPlanProblem: Section = {
  id: 'the-static-plan-problem',
  title: 'The optimizer decides before it has seen anything',
  scene: 'aqe-static-problem',
  focus: 'consequence',
  slide: `## Deciding before seeing

Every choice about how to run your query is made **at plan time**, from numbers nobody measured.

| Question | Answered from |
|---|---|
| How big is that table? | catalog stats — *if they exist* |
| How many rows survive the filter? | a heuristic fraction |
| Are the join keys evenly distributed? | **assumed**, always |

### So a wrong guess isn't a flaky job
It's the **same wrong plan, on every run**, until the statistics change. No feedback loop exists — a query that took four hours doesn't record anywhere that its plan was poor.

### And yet the true numbers do exist — just later
Partway through the job, Spark knows exactly what it has. Every shuffle file has been written and measured.

The question was never *"can we know?"* It was **"will we look?"**`,
  narration:
    "Every optimisation decision Spark makes is taken before the query runs, from numbers nobody measured. How big is that table? From catalog statistics, if someone ever computed them, and from compressed file sizes if not. How many rows survive that filter? A heuristic — some assumed fraction, because the real selectivity is unknowable without running it. Are the join keys evenly distributed? Assumed yes, always, because there's no cheap way to know otherwise. Now, the problem with that isn't that guesses are sometimes wrong. It's the shape of the failure. A wrong guess doesn't give you a flaky job that's sometimes slow — it gives you the same wrong plan on every single run, forever, deterministically. Your nightly pipeline picks a sort-merge join where a broadcast would have been right, takes four hours instead of twenty minutes, finishes, and nothing anywhere records that the plan was poor. Tomorrow it does exactly the same thing. There's no feedback loop at all. But here's the observation that adaptive query execution is built on, and it's a good one. The true numbers do exist. They just exist later. Partway through your job — after the first shuffle — Spark knows precisely how much data there is, how it's distributed, how many rows survived that filter. It's all been written to disk and counted. So the question was never whether the information could be known. It was whether anyone would go back and look at it.",
}
