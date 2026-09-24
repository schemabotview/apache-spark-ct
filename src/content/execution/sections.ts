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

export const theAction: Section = {
  id: 'the-action',
  title: 'The action, and what it costs',
  scene: 'exec-the-action',
  focus: 'trap',
  slide: `## The action

Anything that needs a **real answer**, not another description.

| | |
|---|---|
| **A value to the driver** | \`count\` · \`collect\` · \`first\` · \`take\` |
| **A write to storage** | \`save\` · \`write\` · \`saveAsTable\` |
| **Rows on your screen** | \`show\` — yes, this counts |

### One action, one job
And the job runs the **whole plan behind it. Every time.**

### The trap that follows
\`\`\`
df.count()   # job 1 — reads the source
df.show()    # job 2 — reads it again
df.write(…)  # job 3 — reads it a third time
\`\`\`

Three actions on one DataFrame is **three jobs**, each re-running the entire chain from the source. A DataFrame is a recipe, not a result — and a recipe gets re-cooked.

> This is what \`cache()\` is for: it's the only way to say *"keep the result of this, I'll want it again."*`,
  narration:
    "So if transformations don't do anything, what does? An action. An action is anything that needs a real answer rather than another description. Three kinds. Something that returns a value to the driver — count, collect, first, take. Something that writes to storage — save, write, saveAsTable. And something that shows rows on your screen, which is show. People often don't think of show as an action, and it is one; it's just an action with a small limit on it. The rule is: one action, one job. And here's the part that costs people money. The job runs the whole plan behind it, every time. So watch what happens with a perfectly ordinary-looking piece of code. You call count on your DataFrame to check the size. That's job one — it reads the source, filters, groups, counts. Then you call show to eyeball a few rows. That's job two, and it reads the source again from scratch. Then you write the result out. Job three. Same source, read a third time. Three actions, three complete re-executions, and nothing was reused. The mental model that prevents this is: a DataFrame is a recipe, not a result. When you assign it to a variable, you have not stored any data. You've stored instructions. And instructions get followed again every time you ask for something. This is precisely what cache is for — it's the only way to tell Spark: keep the result of this bit, because I'm going to want it again. Without it, every action pays the full price from the beginning.",
}

export const whyLazyPays: Section = {
  id: 'why-lazy-pays',
  title: 'What laziness buys, and what it costs',
  scene: 'exec-why-lazy',
  focus: 'lazy',
  slide: `## What laziness buys

### If Spark ran each line eagerly
Read one billion rows. Then throw away all but a thousand of them.

### Because it waited, it can rearrange
| | |
|---|---|
| **Predicate pushdown** | the filter moves *into* the read — rows never enter memory |
| **Column pruning** | read 3 columns out of 200 |
| **Operator fusion** | ten steps become one pass |

None of that is possible once you've already started reading.

### The price
**Errors surface at the action, far from the line that caused them.**

A typo in a column name on line 4 doesn't fail on line 4. It fails 200 lines later at \`.show()\`, with a stack trace pointing at \`.show()\`.

> Analysis errors *are* caught early — the analyzer resolves names before anything runs. It's the runtime ones that arrive late.`,
  narration:
    "Let's be concrete about what laziness actually buys, because it's not a small optimisation. Picture the eager version. Line one reads a billion rows into memory. Line two filters them down to a thousand. You have done a billion rows of work to keep a thousand, and there is no way to undo it. Now the lazy version. Spark has the whole chain before it starts, so it can rearrange it. Three things fall out. Predicate pushdown: the filter is moved down into the file reader itself, so those rows are never read off disk in the first place — not read then discarded, never read. Column pruning: your query mentions three columns, so a columnar format like Parquet reads only those three, and the other hundred and ninety-seven are never touched. And operator fusion: a run of narrow operations collapses into a single pass over the rows, with nothing intermediate materialised. Every one of those requires knowing the end of the chain before starting the beginning. Now the price, because there is one, and it's the thing that makes Spark frustrating to debug when you're new. Errors surface at the action, far from the line that caused them. You write a transformation on line four with a bug in it, and line four returns cheerfully. Two hundred lines later you call show, and it fails — with a stack trace pointing at show, which is not where the problem is. One thing that softens this: analysis errors are caught early. If you reference a column that doesn't exist, the analyzer resolves names as you build the plan, and you'll find out immediately. It's the runtime errors — a bad cast, a division by zero, a malformed row — that arrive late and in the wrong place.",
}

export const jobStageTask: Section = {
  id: 'job-stage-task',
  title: 'Job, stage, task, slot',
  scene: 'exec-job-stage-task',
  focus: 'units',
  slide: `## Job, stage, task, slot

Four units. **Each bounded by a different thing** — and being able to name which one you're looking at is most of what reading the Spark UI is.

| Unit | Bounded by |
|---|---|
| **Job** | one action |
| **Stage** | a shuffle |
| **Task** | one partition |
| **Slot** | one core |

### Which means the counts are not yours to choose
- **Jobs = actions.** The only one you control directly.
- **Stages = shuffles + 1.** Count the \`Exchange\`s in \`explain()\`.
- **Tasks = partitions** — *per stage*, not per job. The count changes at every boundary.
- **Slots = executors × cores.** Fixed when the cluster starts.

> "Why does my job have 5 stages?" isn't a mystery. It has four shuffles.`,
  narration:
    "Four words get used constantly in Spark, and they're often used loosely, which makes the UI confusing. Let's pin them down, because each one is bounded by a different thing. A job is bounded by an action. One action, one job. A stage is bounded by a shuffle — a stage runs until data has to move between machines, and then it ends. A task is bounded by a partition. One task processes one partition of one stage. And a slot is bounded by a core. One core runs one task at a time. So the containment goes: a job contains stages, a stage contains tasks, and tasks run in slots. Now here's why this framing is useful rather than just tidy. Three of those four counts are not yours to choose directly. Jobs equal actions — that one you control completely, by choosing how many actions to call. Stages equal shuffles plus one. You don't set that; you cause it, by writing operations that need data to move. Which means the question why does my job have five stages is never a mystery: it has four shuffles, and you can see them in explain before running anything. Tasks equal partitions, and importantly that's per stage, not per job. The count changes at every stage boundary, which is why one stage shows eight tasks and the next shows two hundred. And slots equal executors times cores, fixed when the cluster starts. So when a job is slow, this list tells you where to look. Too many jobs means too many actions. Too many stages means too many shuffles. Too few tasks means not enough parallelism. Too few slots means not enough cluster.",
}

export const theStageCut: Section = {
  id: 'the-stage-cut',
  title: 'Stages break at shuffles, and nowhere else',
  scene: 'exec-stage-cut',
  focus: 'cut',
  slide: `## Stages break at shuffles

Spark packs **as much as it possibly can** into one stage. Exactly one thing makes it stop: a shuffle.

\`\`\`
scan → filter → project        ← all one stage
    ↓ Exchange                 ← the boundary
aggregate → write              ← the next stage
\`\`\`

### The barrier is the expensive part
Stage 1 cannot begin until Stage 0 is **entirely** done. Not mostly. Entirely.

The slowest task in Stage 0 holds up **every** task in Stage 1. One straggler stalls the whole cluster — which is why skew hurts so much more than it looks like it should.

### Three costs at every boundary
- **Pipelining ends** — the fusion stops here
- **Materialisation** — every row is written to local disk first
- **The barrier** — everything waits for the slowest task

> \`n\` shuffles → \`n + 1\` stages. That's the whole algorithm.`,
  narration:
    "Stages aren't a scheduling concept Spark invented with its own rules to learn. A stage is just the run of work between two shuffles. Spark's planner packs as much as it possibly can into one stage — scan, filter, project, another filter, all fused into a single pass over each partition — and the only thing that ever makes it stop and start a new one is a shuffle. So if your job has one shuffle it has two stages. Four shuffles, five stages. You can count them off the plan without running anything. Now, three things cost you at every boundary, and they're worth separating. First, pipelining ends. All that fusing of narrow operations into one pass stops dead at the line. Second, materialisation — every row that the stage produced is written out to local disk before a single task of the next stage begins. And third, the barrier, which is the one people underestimate. Stage one cannot start until stage zero is entirely finished. Not mostly finished. Entirely. Think about what that means with two hundred tasks. A hundred and ninety-nine of them complete in ten seconds. One of them, because it got a partition with far more rows in it, takes forty minutes. For those forty minutes your entire cluster is doing nothing, waiting. Every executor idle, every slot empty, because the next stage cannot legally begin. That's why skew hurts so much more than it seems like it should — it isn't that one task is slow, it's that one slow task idles everything else. So: count the shuffles, and you have counted the stages, and you know where every barrier in your job is.",
}

export const pipelining: Section = {
  id: 'pipelining',
  title: 'Pipelining: three steps, one pass',
  scene: 'exec-pipelining',
  focus: 'actual',
  slide: `## Pipelining

### What people imagine three narrow steps cost
Three passes over the data, and two intermediate collections nobody asked for.

### What it actually costs
**One pass.** Read a row, apply all three operations to it, move on to the next row.

\`\`\`
for row in partition:
    if f1(row) and (r := m(row)) and f2(r):
        emit(r)
\`\`\`

Nothing intermediate is ever materialised. There is no "collection after the filter" — it doesn't exist as a thing in memory.

### Where the fusion stops
- **A wide dependency** — the stage boundary, every time
- **An opaque function** — a Python UDF Spark can't see into, so it can't fuse across it

> This is why "how many transformations" is the wrong question. Ten narrow steps and one narrow step cost about the same. **One wide step costs more than all of them.**`,
  narration:
    "Here's a mental model worth correcting, because it changes how you write. Most people imagine that if you chain a filter, then a map, then another filter, Spark makes three passes over your data and builds two intermediate collections along the way. That's how it would work if you wrote it with lists in plain Python. It is not how Spark works. What actually happens is one pass. Spark reads a row, applies the filter, applies the map, applies the second filter, and if it survives all three, emits it. Then it moves to the next row. There is no collection sitting in memory after the first filter, because that collection never exists as a thing. It was never built. This is called pipelining, and it happens at and below the level of partitions. The practical consequence is that the number of narrow transformations you write barely matters. Ten narrow steps and one narrow step cost about the same, because either way it's one pass over the rows with some function applied. So the question how many transformations is the wrong question to be asking about performance. The right question is how many wide ones. One wide step costs more than all ten narrow ones put together, because it ends the fusion, writes everything to disk, and moves it across the network. Two things stop the fusion. A wide dependency, which is the stage boundary and is unavoidable when you genuinely need to regroup data. And an opaque function — a Python UDF, for instance, which Spark cannot see inside and therefore cannot fuse across. That second one is worth remembering: dropping one Python UDF into an otherwise clean chain can break the pipeline around it.",
}

export const theTask: Section = {
  id: 'the-task',
  title: 'The task: the unit that fails',
  scene: 'exec-the-task',
  focus: 'retry',
  slide: `## The task

**One task = one partition of one stage.** The smallest thing Spark schedules. It can't be split, moved mid-flight, or run by two cores.

A task is three things: the stage's **code**, serialised and shipped to an executor; **one partition** as its only input; and its **output** — shuffle files, or a result to the driver.

### What happens when one fails
1. It's **retried elsewhere** — lineage says how to redo it
2. \`spark.task.maxFailures\` is **4**. Four strikes and the stage gives up.
3. Then the **job** fails

One partition can end everything. That's the path from a single bad row to a dead job.

### Speculative execution
A straggler is run **again, elsewhere**; the first to finish wins, the other is killed.

> Which means a task can run twice. If it writes to an external system, that write happens twice. Tasks must be idempotent.`,
  narration:
    "A task is one partition of one stage, and it's the smallest thing Spark schedules. It can't be split, it can't be moved once it starts, and two cores can't collaborate on one. Concretely, a task is three things: the code for its stage, serialised and shipped out to an executor; one partition as its only input; and an output, which is either shuffle files written to local disk or a result sent back to the driver. Now, failure, because the task is the unit that fails. When a task fails, Spark doesn't give up. It retries it — possibly on a different executor — and lineage tells it exactly how to redo the work. There's a setting, spark dot task dot maxFailures, defaulting to four. Four failures of the same task and the stage gives up. And when a stage gives up, the job fails. So the path from one bad row to a dead cluster job is quite short: the row breaks a task, the task fails four times because the row is still bad, the stage fails, the job fails. That's worth knowing when you're staring at a job that died after twenty minutes of apparently fine progress. One more behaviour to know about: speculative execution. If Spark notices a task running far slower than its peers, it can launch a second copy of the same task somewhere else and take whichever finishes first, killing the other. It's a defence against a slow machine. But notice the implication — a task can run twice. If your task writes to an external system, that write happens twice. So tasks need to be idempotent, and that's not a theoretical concern; it's the reason a job can mysteriously produce duplicate rows in a database.",
}

export const slots: Section = {
  id: 'slots',
  title: 'Slots, waves, and the arithmetic worth doing',
  scene: 'exec-slots',
  focus: 'ragged',
  slide: `## Slots and waves

Tasks queue. They don't run in parallel past the number of cores you actually have.

\`\`\`
200 tasks over 100 slots  →  2 waves, every slot busy
201 tasks over 100 slots  →  3 waves
\`\`\`

That third wave is **one task and 99 idle cores**, for the full duration of a task. One extra partition cost you 50% more wall-clock time.

### The arithmetic worth doing before any tuning
| | |
|---|---|
| \`executors × cores\` | every slot you will ever have |
| \`partitions\` | should be a **multiple** of that |

2–4× the slot count is the usual advice: enough that a slow partition doesn't leave a long ragged tail, few enough that scheduling overhead stays small.

> It's free, it takes ten seconds, and it's frequently the whole problem.`,
  narration:
    "Here's a piece of arithmetic that costs nothing and frequently explains an entire performance problem. Tasks queue. They do not run in parallel beyond the number of cores you actually have. So if your stage has two hundred tasks and your cluster has a hundred slots, those tasks run in two waves. First hundred, then the next hundred. Every slot busy throughout. That's ideal. Now add one partition. Two hundred and one tasks over a hundred slots. That's three waves — and the third wave contains exactly one task, while ninety-nine cores sit completely idle for the full duration of that task. You added half a percent more data and made the stage fifty percent longer in wall-clock time. That's the ragged tail, and it's a real and common effect. So before you tune anything else, do this. Multiply your executors by your cores per executor. That's every slot you will ever have — the hard ceiling on parallelism. Then look at your partition count and ask whether it's a sensible multiple of that number. The usual advice is somewhere between two and four times the slot count. Why more than one times? Because if every task took exactly the same time, one wave would be perfect — but they don't. Some partitions are bigger, some machines are slower. With two to four tasks per slot, a slow one gets absorbed by the others finishing early and picking up more work. Go much higher and scheduling overhead starts to dominate; you'll see tasks completing in single-digit milliseconds, which means you're spending more time dispatching work than doing it.",
}

export const dagScheduler: Section = {
  id: 'the-dag-scheduler',
  title: 'Two schedulers, not one',
  scene: 'exec-dag-scheduler',
  focus: 'lost',
  slide: `## Two schedulers, not one

They're often spoken of as one thing. They're two, and they think at different levels.

### DAG scheduler — thinks in **stages**
- Cuts the plan into stages at every shuffle
- Orders them by what depends on what
- **Skips** stages whose shuffle files are still on disk — this is why the UI says *"skipped"*

### Task scheduler — thinks in **tasks**
- Places tasks in slots, preferring local data
- Retries failures, up to four times
- Launches speculative copies against stragglers

### Where the division shows
\`FetchFailedException\` — a reduce task can't fetch its shuffle input, because the executor that wrote it is gone.

The task scheduler can't fix this: retrying the *task* won't help, the data isn't there. So the **DAG scheduler resubmits the whole map stage** to regenerate the files.

> That's why one lost executor can cause a stage you thought was finished to run again.`,
  narration:
    "People talk about the Spark scheduler as though it's one thing. It's two, and they think at completely different levels. The DAG scheduler thinks in stages. It takes your physical plan, cuts it into stages at every shuffle, and works out the order they have to run in based on what depends on what. It also does something you've probably seen without understanding: it skips stages. If the shuffle files from a previous run are still sitting on disk, the DAG scheduler knows it doesn't need to recompute that stage, and marks it skipped in the UI. People often think skipped means something went wrong. It means something went right. The task scheduler thinks in tasks. Given a stage, it places individual tasks into individual slots, preferring executors that already hold the relevant data. It retries failures up to four times. And it launches speculative copies against stragglers. Now here's where the division between them becomes visible, and it's worth recognising because the error is common. FetchFailedException. A reduce task tries to fetch its shuffle input and can't, because the executor that wrote those files has died or been reclaimed. The task scheduler cannot fix this. Retrying the task is pointless — the data genuinely isn't there any more, and retrying will fail the same way. So it escalates. The DAG scheduler resubmits the entire map stage to regenerate the missing shuffle files. That's why one lost executor can cause a stage you were sure had finished to suddenly run again, and why FetchFailed in your logs is a signal about executor stability rather than about the task that reported it.",
}

export const aRealLineage: Section = {
  id: 'a-real-lineage',
  title: 'One query, end to end',
  scene: 'exec-real-lineage',
  focus: 'chain',
  slide: `## One query, end to end

\`\`\`
df.groupBy("dest").sum("count")
  .orderBy(desc("sum")).limit(5).collect()
\`\`\`

One action. **Two shuffles. Three stages** — and the task count changes at every boundary.

| | |
|---|---|
| **Stage 0** — 8 tasks | scan 8 files, **partial aggregate** per partition |
| ↓ \`Exchange\` by key | the \`groupBy\` |
| **Stage 1** — 200 tasks | final aggregate, then a local top-5 per partition |
| ↓ \`Exchange\` to one | the \`orderBy\` + \`limit\` |
| **Stage 2** — 1 task | merge 200 local top-5s, take 5 |

### Two things worth noticing
**The partial aggregate in Stage 0.** Spark combines *before* shuffling, so only one row per key per partition crosses the network.

**Stage 2 has one task** — a global sort needs one place. That single task is a bottleneck by construction, which is why \`limit\` after a sort is fine and a full sort of everything isn't.`,
  narration:
    "Let's put the whole course together on one real query: group by destination, sum the counts, sort descending, take the top five, collect. One action — collect — so one job. Two shuffles, so three stages. Watch the task counts change. Stage zero has eight tasks, one per input file. It scans, and it does something clever: a partial aggregate, per partition. Before anything moves, each partition sums its own rows down to one row per destination it saw. Stage zero ends at an Exchange that partitions by destination — that's the groupBy needing all rows for a key together. Stage one has two hundred tasks, because two hundred is the shuffle default. It finishes the aggregate, and then computes a local top five within each partition. Stage one ends at a second Exchange, this time to a single partition, because a global sort has to happen somewhere. Stage two has exactly one task: it merges two hundred local top-fives and takes the overall five. Two things worth noticing. First, the partial aggregate in stage zero. That's the map-side combine, and it's why a groupBy followed by a sum is dramatically cheaper than it looks — only one row per key per partition ever crosses the network, rather than every row. Spark does that for you in the DataFrame API. Second, stage two has one task, and that's a bottleneck by construction. A global ordering has to be decided in one place. This is exactly why a limit after a sort is fine — each partition only sends its own top five — and why sorting an entire large dataset without a limit is something to think twice about.",
}

export const readingExplain: Section = {
  id: 'reading-explain',
  title: 'Reading the plan',
  scene: 'exec-reading-explain',
  focus: 'code',
  slide: `## Reading the plan

\`df.explain()\` — and **read it bottom-up.** The scan is the leaf; the last operation is at the top.

### The three things to look for
| | |
|---|---|
| \`Exchange\` | a shuffle. **Count them** — that's the cost of your query. |
| \`ReadSchema\` | which columns are actually read. Fewer than the table has = **column pruning worked**. |
| \`PushedFilters\` | filters that reached the file reader instead of running after the scan |

### Two HashAggregates is not a bug
The lower one is the **partial** aggregate, before the shuffle. The upper one finishes the job after it. Seeing both means the map-side combine is happening.

### Other modes
\`\`\`
df.explain("formatted")  # per-node detail
df.explain("cost")       # with size estimates
\`\`\`

> This is the only honest answer about what Spark will do. Everything else is a guess.`,
  narration:
    "Let's finish with the tool that makes all of this checkable rather than theoretical. Call explain on any DataFrame and you get the physical plan. The first thing to know is to read it bottom-up. The leaf at the bottom is the file scan, and execution flows upward to the last operation at the top. It reads like a tree, because it is one. Three things to look for. First, Exchange. Every Exchange is a shuffle, which means a stage boundary, a disk write, a network fetch, and a barrier. Count them. That count is essentially the cost of your query, and you can see it without running anything. Second, ReadSchema. This tells you which columns are actually going to be read. If your table has two hundred columns and ReadSchema lists three, column pruning worked and you're reading a fraction of the data. If it lists all two hundred, something in your query is forcing a full read, and that's worth investigating. Third, PushedFilters. These are the filters that made it all the way down into the file reader, so matching rows are skipped before they're ever decoded. A filter that isn't pushed still runs, just later and on more data. One thing that confuses people: seeing two HashAggregate operators for a single groupBy. That's not a bug or a duplication. The lower one is the partial aggregate that runs before the shuffle — the map-side combine — and the upper one finishes the job after it. Seeing both is the sign that Spark is combining early, which is what you want. There are richer modes too: explain formatted gives an operator list with per-node detail, and explain cost includes size estimates, which is how you check whether the optimizer's guess about a table's size is anywhere near reality.",
}
