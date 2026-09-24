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

export const materializationPoints: Section = {
  id: 'materialization-points',
  title: 'A shuffle is where guessing stops being necessary',
  scene: 'aqe-materialization',
  focus: 'known',
  slide: `## Where guessing stops

A stage runs to completion: every task done, every shuffle file written and closed.

**At that instant, these are counts — not estimates:**

| | |
|---|---|
| **Bytes per partition** | all 200 of them, exactly |
| **Rows per partition** | so **skew is now visible** |
| **The real output size** | not the estimate from before |

### Which makes a shuffle the natural place to re-plan
It's already a barrier — everything stops and waits there anyway (that's what a stage boundary *is*). So re-planning costs nothing extra in synchronisation. The data is already materialised and already measured.

AQE calls the piece between two of these a **query stage**.

> Notice what this implies: the re-planning opportunities in your job are exactly your shuffles. No shuffles, no opportunities.`,
  narration:
    "So when, exactly, does Spark know the truth? At a shuffle. Think about what a completed stage means. Every task has finished. Every task has written its shuffle output to local disk and closed the file. And in doing so, every task reported how many bytes and how many rows it wrote, per destination partition. So at the moment a stage completes, Spark has exact figures. Not estimates — counts. It knows how many bytes are in each of the two hundred reduce partitions. It knows the row counts, which means skew is now directly visible rather than assumed away. And it knows the real total output size of that stage, which may be nothing like what the optimizer predicted when it planned the thing. Now, why is a shuffle the natural place to act on that? Because it's already a barrier. The next stage cannot start until this one has completely finished — that's what a stage boundary is. Everything stops and waits there regardless. So inserting a re-planning step costs nothing extra in synchronisation; you're using a pause that was already happening. And the data is already materialised, already written down, already counted. AQE calls the piece of a plan between two of these boundaries a query stage, and query stages are the unit it works in. There's an implication worth drawing out. The opportunities to re-plan your job are exactly your shuffles. If your job has three shuffles, there are three moments where Spark can correct itself. If it has none, there are none, and adaptive execution has nothing to do.",
}

export const theLoop: Section = {
  id: 'the-loop',
  title: 'Plan a bit, run a bit, look, plan again',
  scene: 'aqe-loop',
  focus: 'loop',
  slide: `## The loop

\`\`\`
run a query stage
  → read its real statistics
  → re-optimize what's left
  → repeat at the next shuffle
\`\`\`

Catalyst runs **again**, on the remaining plan, now knowing the truth about everything upstream.

### Which changes what a plan *is*
| | |
|---|---|
| **Before** | one plan, fixed at submit time |
| **After** | a plan per stage, each better informed than the last |

### \`spark.sql.adaptive.enabled\` — **on by default since Spark 3.2**
That matters for how you read older advice. Anything telling you to *turn AQE on* was written for 3.0 or 3.1. On a current cluster the question isn't whether to enable it — it's **knowing what it's already doing to your query.**

> Which is also why a plan you print before running doesn't match what ran. §10.`,
  narration:
    "So the mechanism is a loop. Run a query stage to completion. Read the real statistics it produced. Re-optimize everything that's left, now knowing the truth about everything upstream. Then run the next stage, and repeat at the next shuffle. Catalyst literally runs again — the same optimizer, the same rules, but this time with measured numbers substituted for the estimates in the part of the plan that's already executed. And that changes what a plan is, conceptually. Before, a plan was one artefact, fixed when you submitted the job, executed as written. Now it's a sequence: a plan per stage, each one better informed than the last, because each one has more measured data behind it. Now, the configuration detail that matters most for reading anything written about this. Spark dot sql dot adaptive dot enabled has been true by default since Spark three point two. And that's a meaningful dividing line, because a great deal of the writing about AQE — including most of what you'll find by searching — was written for three point zero or three point one, when it was off by default. So that advice tells you to turn it on. On any current cluster, it's already on. The question isn't whether to enable it; it's knowing what it's already doing to your query, because it is doing things, whether or not you asked. And that leads directly to a practical consequence that confuses people, which is that the plan you print before running a query doesn't match the plan that actually ran. We'll come back to that at the end.",
}

export const coalescePartitions: Section = {
  id: 'coalesce-partitions',
  title: 'Coalescing: the end of tuning shuffle.partitions',
  scene: 'aqe-coalesce',
  focus: 'why',
  slide: `## Coalescing partitions

The filter upstream removed 99% of the rows. Nothing downstream was told, so you get **200 partitions holding 8 MB each** — scheduling a task costs more than the work in it.

### After
AQE merges **contiguous** partitions toward a target:

\`\`\`
spark.sql.adaptive.advisoryPartitionSizeInBytes = 64MB
\`\`\`

200 partitions become about 12. Same data, a twelfth of the tasks.

### Why this is worth more than it sounds
It makes the old advice **obsolete**. You used to size \`spark.sql.shuffle.partitions\` for the whole query — one number, serving a stage that shuffles 2 TB and a stage that shuffles 40 MB.

Now: **set it high and let AQE bring it down, per stage.** One number never fitted all of them.

> Contiguous merging only. It combines neighbours; it can't redistribute, which is why it fixes *too many small*, never *one too big*. That's §6.`,
  narration:
    "The first thing AQE does with those statistics is the one you'll see most often. Here's the situation. Your job reads a large table, applies a filter that removes ninety-nine percent of the rows, and then groups by something. The shuffle after that filter produces two hundred partitions, because two hundred is the default, and those two hundred partitions hold about eight megabytes each. So you're scheduling two hundred tasks, each with its own serialisation and dispatch and tracking overhead, to process eight megabytes. The overhead genuinely exceeds the work. AQE looks at the measured sizes and merges contiguous partitions together, aiming at a target size — advisoryPartitionSizeInBytes, sixty-four megabytes by default. Two hundred partitions become about twelve. Identical data, a twelfth of the task count, and the scheduling overhead essentially disappears. Now, why does this matter more than a modest speedup? Because it makes a whole category of tuning obsolete. Previously you set spark dot sql dot shuffle dot partitions once, for the entire query. But a real query has several stages, and one of them might shuffle two terabytes while another shuffles forty megabytes. One number cannot be right for both. You'd pick something in the middle and be wrong twice. With AQE the advice inverts: set it high — so no individual stage is starved of parallelism — and let AQE bring it down per stage, using measurements. One caveat worth knowing. The merging is contiguous: it combines neighbouring partitions. It cannot redistribute. So it fixes the problem of too many small partitions, and never the problem of one partition that's too big. That's a different mechanism.",
}

export const strategySwitch: Section = {
  id: 'strategy-switch',
  title: 'Switching the join, mid-flight',
  scene: 'aqe-strategy-switch',
  focus: 'switch',
  slide: `## Switching the join

**Planned** as a sort-merge join, because the right side *estimated* at 4 GB — no statistics, a filter of unknown selectivity.

**Then the stage ran**, and it measured **3 MB**.

| | |
|---|---|
| Estimated | 4 GB — a guess built on a guess |
| Actual | **3 MB** — counted, from the shuffle files |

### So it switches
\`\`\`
SortMergeJoin  →  BroadcastHashJoin
\`\`\`

The sort disappears. The second shuffle disappears. A *local shuffle reader* avoids re-reading data that's already sitting on the right executors.

### Why the estimate was so wrong
This isn't an exceptional case. Filter selectivity is genuinely hard to estimate, and Parquet's compression makes on-disk size a poor proxy for in-memory size. **Being off by three orders of magnitude is ordinary.**

> Which is why this particular re-plan pays for AQE on its own.`,
  narration:
    "The second thing AQE does is the one with the largest single payoff. Here's the setup. Spark plans a join between two tables. The right side has no statistics — maybe it's the result of a filter, maybe nobody ever ran ANALYZE TABLE — so the optimizer estimates it at four gigabytes, which is well over the broadcast threshold. It plans a sort-merge join: shuffle both sides, sort both sides, merge. Expensive, but the right call for two large tables. Then the stage producing that right side actually runs. And it produces three megabytes. Not four gigabytes — three megabytes, measured from the shuffle files. The estimate was off by three orders of magnitude. Without AQE, nothing can be done: the plan says sort-merge, so you shuffle and sort a table small enough to fit in a browser tab. With AQE, Spark sees the real size at the stage boundary and switches to a broadcast hash join. The sort disappears entirely. The second shuffle disappears. And there's a nice detail: a local shuffle reader lets it avoid re-reading data that's already sitting on the right executors. Now, why was the estimate so catastrophically wrong? This is worth saying plainly, because it sounds like an edge case and isn't. Filter selectivity is genuinely hard to estimate — how many rows survive a condition depends on the data, and the optimizer has a heuristic, not knowledge. And Parquet's compression means on-disk size is a poor proxy for in-memory size. Being wrong by orders of magnitude is completely ordinary. This one re-plan justifies adaptive execution on its own.",
}

export const skewSplit: Section = {
  id: 'skew-split',
  title: 'Splitting a skewed partition',
  scene: 'aqe-skew-split',
  focus: 'split',
  slide: `## Splitting skew

### A partition is skewed only if **both** tests pass
| | |
|---|---|
| \`skewedPartitionFactor\` | more than **5×** the median |
| \`skewedPartitionThresholdInBytes\` | **and** more than **256 MB** |

Either alone gives false positives — on a tiny stage, or on a uniformly large one.

### The fix: split one side, replicate the other
Splitting alone would **lose matches**. If the big partition becomes 5 pieces, each piece still needs the rows it joins against — so the counterpart partition is **copied to all 5.**

One 90-minute task becomes five 18-minute tasks.

### Where it stops
| | |
|---|---|
| **A single hot key** | one partition, **nothing to cut along** |
| **Joins only** | sort-merge and shuffled hash |

> If 40% of your rows are \`user_id = NULL\`, all of them must still meet in one place. AQE can't help, and neither can anything else.`,
  narration:
    "The third re-plan is skew handling, and it's the one where it's most important to be precise about the limits. First, detection. A partition is considered skewed only if both of two tests pass. It must be more than five times the median partition size — that's skewedPartitionFactor. And it must be more than two hundred and fifty-six megabytes in absolute terms. Both, not either. And the reason for both is that either one alone produces false positives. On a tiny stage, one partition being five times the median might mean fifty kilobytes against ten — technically skewed, completely irrelevant. On a uniformly large stage, everything is over two hundred and fifty-six megabytes and nothing is actually skewed. Together they identify genuine outliers. Now the fix. Split the skewed partition into pieces. But you can't just split it, because the join would lose matches — each piece only holds some of the rows for its keys, and it still needs the rows on the other side to join against. So the counterpart partition on the other side of the join gets replicated, copied to every piece. Five pieces means five copies of the matching partition. That's a real cost, and it's why this only triggers when the skew is severe enough to be worth it. One ninety-minute task becomes five eighteen-minute tasks, running in parallel. Now the limit, and it's absolute. A single hot key cannot be split. If forty percent of your rows have a null user id, every one of those rows must end up in the same place for the aggregate to be correct. There's no boundary inside that key to cut along. AQE can't help with that, and neither can anything else — that's a data problem, not a planning problem.",
}

export const dynamicPartitionPruning: Section = {
  id: 'dynamic-partition-pruning',
  title: 'Dynamic partition pruning',
  scene: 'aqe-dpp',
  focus: 'apply',
  slide: `## Dynamic partition pruning

The classic star-schema shape:

\`\`\`sql
SELECT ... FROM fact_sales f
JOIN dim_date d ON f.date_id = d.id
WHERE d.quarter = 'Q3-2026'
\`\`\`

The filter is on the **dimension**. The fact table has **no filter it can use** — nothing in the query mentions a fact column to prune on.

### So Spark builds the filter it needs
Run the **small side first** — it was being broadcast anyway. Collect the join keys that **survived**. Turn them into \`date_id IN (…)\` and push it into the fact table's scan.

**90 partitions read out of 730.** The rest are never listed, never opened.

### Which is the interesting part
You never wrote a filter on the fact table. Spark **derived one** from the other side of a join — a filter that couldn't exist until the dimension side had run.`,
  narration:
    "Dynamic partition pruning solves a different problem, and it's the one with the biggest wins on real data warehouses. Here's the shape, and if you've worked with a star schema you'll recognise it immediately. You have a huge fact table — sales, partitioned by date, two years of it. You have a small dimension table of dates. You join them, and you filter on a dimension column: give me the third quarter of twenty twenty-six. Now think about what the fact table can prune on. Nothing. Your query contains no filter on any fact table column. The only filter is on the dimension, on the other side of a join. So by the normal rules, Spark reads every partition of the fact table — all seven hundred and thirty days of it — joins the lot, and discards everything outside Q3. What dynamic partition pruning does is build the missing filter. The dimension side is small and is being broadcast anyway, so it runs first. Spark collects the join key values that survived the quarter filter — ninety date ids. It turns those into a predicate: date id in this set of ninety values. And it pushes that predicate down into the fact table's file scan, where it becomes partition pruning: ninety directories read out of seven hundred and thirty. The rest are never listed and never opened. The interesting part is the epistemics of it. You never wrote a filter on the fact table. Spark derived one, from the other side of a join, and the filter it derived could not have existed at planning time because the values in it weren't known until the dimension side actually ran.",
}

export const dppVsStatic: Section = {
  id: 'dpp-vs-static-pruning',
  title: 'Dynamic vs static pruning',
  scene: 'aqe-dpp-vs-static',
  focus: 'note',
  slide: `## Dynamic vs static

| | Static | Dynamic |
|---|---|---|
| **The filter** | one you wrote | one Spark **derived** |
| **Decided** | at plan time | at run time |
| **Needs** | a literal in the query | a join + a partitioned fact table |

\`WHERE year = 2026\` is static: the value is a literal, visible before anything runs, and directories are excluded immediately.

DPP is the same *pruning*, with a filter that couldn't be known until part of the job had executed.

### And DPP is **not** part of AQE
Despite arriving in the same release and being discussed together. Separate optimization, separate setting, on by default since **3.0** — a version earlier than AQE's default.

### What it needs to work
- The fact table must be **partitioned on the join key** — no partitions, nothing to prune
- The dimension side must be **broadcastable**, so it can run first and cheaply

> Which makes it another reason partitioning choices matter: DPP can only prune what you partitioned by.`,
  narration:
    "It's worth separating dynamic partition pruning from ordinary pruning, because they're often conflated and they work quite differently. Static pruning is what happens when you write where year equals twenty twenty-six. The value is a literal, sitting in your query text, visible to the optimizer before anything runs. So Spark excludes directories immediately, at plan time, and never thinks about them again. Dynamic pruning achieves the same thing — excluding directories — but with a filter that couldn't possibly be known at plan time, because its values had to be computed by running part of the job. Same mechanism at the storage layer, completely different provenance for the filter. Now a point of precision that matters if you're reading documentation. Dynamic partition pruning is not part of adaptive query execution. They arrived in the same release, Spark three point zero, they're discussed together constantly, and they're frequently assumed to be the same feature. They aren't. DPP has its own configuration setting, and it's been on by default since three point zero — a version earlier than AQE's default, which came in three point two. You can have one without the other. Two conditions for DPP to actually do anything, and both are about how you laid your data out. The fact table has to be partitioned on the join key — if it isn't partitioned, there are no directories to prune, and the derived filter just becomes an ordinary row filter. And the dimension side has to be broadcastable, so it can run first and cheaply. Which makes this one more reason your partitioning choices matter: DPP can only prune along the column you partitioned by.",
}

export const whatItDoesNotFix: Section = {
  id: 'what-it-does-not-fix',
  title: 'What it does not fix',
  scene: 'aqe-limits',
  focus: 'others',
  slide: `## What it doesn't fix

### It right-sizes a shuffle. It never removes one.
Broadcasting, bucketing and reusing partitioning are all still worth more than anything here — they delete the shuffle; AQE makes a shuffle you're having anyway less bad.

### Three it can't reach
| | |
|---|---|
| **A single hot key** | one partition, nothing to cut along |
| **A job with no shuffle** | no boundary, so no re-plan |
| **The first stage** | nothing has been measured yet |

All three are the same limit: AQE only acts **at a shuffle boundary**, using what that shuffle measured.

### And it isn't a substitute for statistics
| | |
|---|---|
| \`ANALYZE TABLE\` | makes the **first** plan right |
| **AQE** | corrects a **wrong** one |

Both are worth having. AQE fixes things after the fact and costs a re-plan per stage; good statistics mean there was nothing to fix.

> It's a correction mechanism, not a planning strategy. Treating it as one is how people end up with jobs that are adequate rather than fast.`,
  narration:
    "Let's be clear about the limits, because adaptive execution gets described as though it solves performance, and it doesn't. First and most important: it right-sizes a shuffle, it never removes one. Broadcasting a small table, bucketing a table you join repeatedly, not throwing away partitioning you already have — all of those delete a shuffle entirely, and all of them are worth more than anything in this course. AQE makes a shuffle you were going to have anyway less bad. That's valuable, and it's a smaller category of win. Three things it can't reach, and they're all the same limit viewed from different angles. A single hot key can't be split, because one key's rows must all meet in one place and there's no boundary inside it to cut along. A job with no shuffle gets no adaptive behaviour at all, because there's no boundary at which to re-plan. And the first stage of any job can't benefit, because nothing has been measured yet — the first stage runs on estimates, always. The common thread: AQE only ever acts at a shuffle boundary, using what that shuffle measured. No boundary, no measurement, no help. And finally, it's not a substitute for computing statistics, though people treat it as one. Running ANALYZE TABLE means the first plan was right. AQE means a wrong plan gets corrected — after a stage has already run under it, and at the cost of a re-planning step per stage. Both are worth having and they're not alternatives. Treating AQE as a planning strategy rather than a correction mechanism is how people end up with jobs that are adequate instead of fast.",
}

export const seeingIt: Section = {
  id: 'seeing-it',
  title: 'Seeing what it decided',
  scene: 'aqe-seeing-it',
  focus: 'code',
  slide: `## Seeing what it decided

### \`isFinalPlan\` is the flag to read
\`\`\`
AdaptiveSparkPlan isFinalPlan=false   ← a guess
AdaptiveSparkPlan isFinalPlan=true    ← what happened
\`\`\`

Explain **before** running and you get \`false\` — the static plan, which may be nothing like what executes. Explain the same DataFrame **after** an action and you get \`true\`, with both the **Final Plan** and the **Initial Plan** printed side by side.

That's the single most useful diff in Spark: what it thought, next to what it did.

### The operators AQE inserts
| | |
|---|---|
| \`AQEShuffleRead coalesced\` | partitions were merged (§4) |
| \`AQEShuffleRead skewed\` | a partition was split (§6) |
| \`BroadcastHashJoin\` where the initial plan had \`SortMergeJoin\` | the strategy changed (§5) |

> The **SQL tab** shows both plans together — easier to read than \`explain\` output, and it's where to start.`,
  narration:
    "Let's finish with how to see any of this, because adaptive execution changes what explain means and that catches people out. If you call explain on a DataFrame before running it, you get a plan with AdaptiveSparkPlan, isFinalPlan equals false at the top. That false is doing important work. It's telling you this is the static plan — the guess — and that it may be nothing like what actually executes. People print that, see a sort-merge join, and conclude their query does a sort-merge join. It might not. Now run an action, and explain the same DataFrame again. Now isFinalPlan is true, and you get something much more useful: both plans printed together. There's a Final Plan section showing what actually ran, and an Initial Plan section showing what was originally planned. That side-by-side is, I think, the single most useful diff available in Spark — what the optimizer thought, next to what it did. Three things to look for in the final plan. AQEShuffleRead with the word coalesced means partitions were merged. AQEShuffleRead with the word skewed means a partition was split. And if you see a BroadcastHashJoin in the final plan where the initial plan had a SortMergeJoin, the strategy was switched mid-flight — which is the big one. In practice the easiest place to look at all of this is the SQL tab in the Spark UI, which renders both plans as a diagram with the metrics attached. It's considerably easier to read than explain output, and it's where I'd start rather than finish.",
}
