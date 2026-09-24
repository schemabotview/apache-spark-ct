import type { Section } from '../types'

export const theUnboundedTable: Section = {
  id: 'the-unbounded-table',
  title: 'A stream is a table that never finishes',
  scene: 'str-unbounded-table',
  focus: 'result',
  slide: `## A stream is a table

Not a sequence of events to react to. **A table** — one that happens never to be finished.

New data arriving is **rows appended.** That's the whole model.

### So your query is a query against that table
\`\`\`python
df.groupBy("dest").count()
\`\`\`
The same line you'd write over a finished table. Unchanged.

### And the result is kept up to date
| | |
|---|---|
| **Think:** recomputed from all input, every time | the model you reason with |
| **Run:** incrementally | what actually happens |

That gap is an implementation detail — the point is you get to *reason* with the simple model and still get efficient execution.

> Which is why streaming stops being a separate skill. If you can write the batch query, you can write the streaming one.`,
  narration:
    "Structured Streaming's central idea is a reframing, and it's worth sitting with because everything else follows from it. A stream is not a sequence of events you react to, with callbacks and handlers and ordering to worry about. A stream is a table. It's a table that happens never to be finished. New data arriving is rows being appended to the bottom of it. That's the whole model. And because it's a table, your query is a query against a table. You write group by destination, count — exactly the line you would write against a finished table sitting in a file. Not an analogous line, not a streaming equivalent. The same line. Then the result is a table too, and Spark keeps it up to date as input arrives. Now, the way to reason about it is: every time new data arrives, the entire query is recomputed from all input received so far, and the result table is replaced. That's the mental model, and it's simple enough to reason about correctly. What actually happens is that Spark executes it incrementally, because recomputing from all input forever would be impossible. But the point of the model is that you don't have to think about that to get the right answer. You think in terms of a table and a query; the engine handles the rest. The consequence is that streaming stops being a separate skill with its own concepts. If you can write the batch query, you can write the streaming one. What's left to learn is time, and state — and those are the back half of this course.",
}

export const theSameEngine: Section = {
  id: 'the-same-engine',
  title: 'Two lines change',
  scene: 'str-same-engine',
  focus: 'shared',
  slide: `## Two lines change

\`read\` → \`readStream\`. \`write\` → \`writeStream\`. **Everything between is identical.**

### And identical means identical
| | |
|---|---|
| **Catalyst** | the same optimizer, the same rules |
| **Tungsten** | the same generated code |
| **The shuffle** | the same mechanism — and the same skew |

There is no second engine. The batch engine is run incrementally.

### Which means two things you might not expect
- Everything you know about tuning batch Spark **applies unchanged**
- Streaming jobs get skewed, spill, and suffer from 200 default shuffle partitions — for **exactly** the same reasons

> A slow streaming query is usually a slow Spark query, and debugs the same way.`,
  narration:
    "Here's the claim made concrete. Take a batch job: read a parquet directory, group by destination, count, write the result. Now make it streaming. You change read to readStream. You change write to writeStream. That's it. Everything between those two lines is character-for-character identical. And identical means identical, not analogous. The same parser produces the same tree. The same analyzer resolves the same names. Catalyst applies the same optimization rules — predicate pushdown, column pruning, all of it. Tungsten generates the same fused loops. A groupBy produces a shuffle, with the same partitioner and the same two hundred default partitions. There is no second engine hiding behind the streaming API. The batch engine is being run incrementally. Two consequences follow, and both are practically useful. The first is happy: everything you know about tuning batch Spark applies unchanged. Reading a plan, counting Exchanges, checking for pushdown, sizing partitions — all of it transfers. You are not learning a new performance model. The second is less happy but equally useful: streaming jobs get skewed, spill to disk, and suffer from badly-sized shuffle partitions, for exactly the same reasons batch jobs do. People sometimes treat a slow streaming query as a mysterious streaming problem and go looking for streaming-specific settings. Usually it's just a slow Spark query, and it debugs the same way — look at the plan, look at the stages, find the skewed task.",
}

export const theTrigger: Section = {
  id: 'the-trigger',
  title: 'The trigger: when a batch runs',
  scene: 'str-trigger',
  focus: 'table',
  slide: `## The trigger

Decides **when** a batch runs. Nothing else changes — same query, same output, different rhythm.

| Trigger | What it does |
|---|---|
| **default** | a new micro-batch as soon as the last finishes |
| **\`processingTime("1 minute")\`** | one batch a minute, on the clock |
| **\`availableNow\`** | process everything waiting, then **stop** |
| **continuous** *(experimental)* | record at a time, ~1 ms — map-like ops only |

### \`availableNow\` is the one people miss
A **batch** job with a **streaming** job's bookkeeping. It picks up where the last run stopped, processes what's arrived, and exits.

So a nightly job doesn't need a "which files did I do last time?" table — the checkpoint already knows.

> \`processingTime\` is a *minimum*, not a schedule. If a batch takes 90 s on a 60 s trigger, the next starts immediately and you're falling behind — which is the first thing to check when latency creeps.`,
  narration:
    "The trigger decides when a micro-batch runs. It doesn't change the query, the semantics, or the output — just the rhythm. The default trigger starts a new batch as soon as the previous one finishes. That gives you the lowest latency available, and it means batch sizes vary with however much data turned up. Processing-time with an interval runs one batch on a fixed clock — every minute, say. That gives you predictability, which matters if downstream systems expect a rhythm. AvailableNow processes everything currently waiting and then stops. And this one deserves attention because people miss it. It's a batch job with a streaming job's bookkeeping. It picks up exactly where the last run stopped, processes whatever has arrived since, writes the results, and exits. Which means a nightly job doesn't need its own table tracking which files it processed last time — the checkpoint already knows. You get incremental batch processing with no bookkeeping code of your own. And continuous processing is an experimental mode that runs record-at-a-time for around a millisecond of latency, rather than micro-batches. It supports only map-like operations — no aggregations, no joins — so it's rarely the answer. One thing worth knowing about processing-time triggers: the interval is a minimum, not a schedule. If you set a sixty-second trigger and a batch takes ninety seconds, Spark doesn't run two at once. The next one starts immediately, and you're now permanently behind and falling further. That's the first thing to check when a streaming job's latency starts creeping up.",
}

export const incrementalExecution: Section = {
  id: 'incremental-execution',
  title: 'Incremental execution, and the state it needs',
  scene: 'str-incremental',
  focus: 'cost',
  slide: `## Incremental execution

The model says: **recompute from all input, every batch.** Correct — and impossible. The input grows forever.

### So the engine keeps the running result
\`\`\`
state: dest → 1,204     (what the last batch left)
   +  17 new rows       (this batch's input)
   =  1,221             (and the state is updated)
\`\`\`

Same answer. Work proportional to **what arrived**, not to everything ever received.

### Which introduces the only genuinely new thing
**State** — something that must survive between batches, *and across restarts.*

That's the dividing line in this whole subject:

| | |
|---|---|
| **Stateless** — \`filter\`, \`select\`, \`withColumn\` | each row alone; nothing to keep |
| **Stateful** — \`groupBy\`, joins, dedup | needs memory of earlier rows |

> Stateless streaming is nearly free. Every hard problem in the rest of this course is a state problem.`,
  narration:
    "Now, how does the model become something that can actually run? The model says recompute from all input on every batch. That's correct and completely impossible — after a year, all input is a year of data, and you'd be reprocessing it every minute. So the engine keeps the running result instead. If you're counting events per destination, it holds a count per destination. When seventeen new rows arrive, it adds them to the existing counts. One thousand two hundred and four becomes one thousand two hundred and twenty-one. The answer is identical to what a full recomputation would give, but the work is proportional to what just arrived rather than to everything ever received. And that introduces the one genuinely new thing in streaming, which is state. Something that has to survive between batches, and — because jobs get restarted, deployed, and killed — across restarts too. State is the dividing line that organises this entire subject, and it's worth making explicit. Stateless operations look at each row on its own: filter, select, withColumn, casting, parsing JSON. Nothing needs to be remembered, so these are nearly free in streaming and behave exactly as they do in batch. Stateful operations need memory of earlier rows: aggregations, joins, deduplication, anything windowed. Those need state, and state needs to be bounded, durable, and eventually cleaned up. Every genuinely hard problem in the rest of this course — watermarks, output modes, stream-stream joins — is a state problem wearing a different hat.",
}

export const theOffsetLog: Section = {
  id: 'the-offset-log',
  title: 'The checkpoint, and why the order matters',
  scene: 'str-offset-log',
  focus: 'order',
  slide: `## The checkpoint

Not an optimisation. **The query's identity.** Delete it and you have a different query, with no memory of anything.

\`\`\`
checkpoint/
 ├── offsets/   what this batch WILL do  ← FIRST
 ├── commits/   what a batch DID do      ← after
 ├── state/     the running aggregates
 └── metadata   the query id
\`\`\`

### Write-ahead, and the **order** is the whole point
| On restart | Means |
|---|---|
| offset, **no** commit | it crashed → redo that batch |
| offset **and** commit | it finished → move on |

Replay, not guesswork. A restart reprocesses **exactly** the batch that was in flight.

> Two queries must never share a checkpoint, and changing your query can make an old one unreadable. It's part of the deployment.`,
  narration:
    "Fault tolerance in streaming rests on the checkpoint directory, and the most important thing to understand about it is that it isn't an optimisation. It's the query's identity. Delete it and you don't have the same query with a cleared cache — you have a different query that has never run and remembers nothing. Inside there are four things. An offsets directory, recording what each batch will process. A commits directory, recording what each batch did process. A state directory holding the running aggregates. And metadata with the query's id. Now here's the mechanism, and the order is the entire point. Before processing a batch, Spark writes the offset — the exact range of source data this batch covers. Then it does the work. Then it writes the commit. Write-ahead logging, and it makes a crash distinguishable from a completion. On restart, Spark looks at the last batch. If there's an offset but no commit, that batch was in flight when the process died, so it gets redone from the recorded offsets. If there's both an offset and a commit, it completed, and the next batch starts. That's replay, not guesswork, and it's why a restarted streaming job reprocesses exactly the batch it was working on rather than some approximate window of recent data. Two operational notes. Two queries must never share a checkpoint directory — they'll corrupt each other's view of progress. And changing your query can make an existing checkpoint unreadable, because the state format depends on the query shape. Treat the checkpoint as part of your deployment, not as a temporary file somewhere in slash tmp.",
}

export const outputModes: Section = {
  id: 'output-modes',
  title: 'Output modes',
  scene: 'str-output-modes',
  focus: 'table',
  slide: `## Output modes

What gets written **out of** the result table. Not a preference — each is legal only for certain queries, and Spark refuses the others at start-up.

| Mode | Writes | Needs |
|---|---|---|
| **append** | rows that will never change | a **watermark**, for aggregations |
| **update** | rows that changed | a sink that can **upsert** |
| **complete** | the **whole** table, every batch | aggregations · state kept forever |

### Why append needs a watermark
Append promises a row won't change once written. For a running count, Spark can't know that until no more rows for that key can arrive — which is what a watermark declares.

### \`complete\` is the one that ends in tears
Fine in a demo with five keys. Fatal with fifty million.`,
  narration:
    "Output mode decides what gets written out of the result table, and it's not a preference — each mode is legal only for certain kinds of query, and Spark will refuse to start the ones that don't work. Append writes only rows that will never change again. Update writes rows that changed in this batch. Complete writes the entire result table, every batch. The interesting one is append, because of what it requires. Append makes a promise: once a row is written, it won't change. For a simple filter that's trivially true — a row either passed or it didn't. But for a running count per key, Spark cannot make that promise, because another row for that key could arrive at any moment and change the count. So append is illegal for an aggregation unless you've defined a watermark, because the watermark is what declares when no more rows for a window will arrive. That's a nice example of the constraints being real rather than arbitrary. Update is the most generally useful. It writes rows that changed, which is what you want for a dashboard or a lookup table. The catch is that your sink has to handle an upsert rather than a plain insert, or you'll accumulate duplicate versions of the same key. And complete is the one that ends in tears. It rewrites the entire result table every single batch, which means all state is kept forever — every key ever seen, held indefinitely. In a tutorial with five keys, it's the mode that makes the demo work. In production with fifty million keys, it's a job that slowly dies. The error messages in this area are unusually good, by the way: Spark tells you which modes your query supports and why. Worth reading rather than guessing.",
}

export const sinksAndIdempotence: Section = {
  id: 'sinks-and-idempotence',
  title: 'Exactly-once needs the sink\'s cooperation',
  scene: 'str-sinks',
  focus: 'three',
  slide: `## Exactly-once

Needs **three** things. Spark provides two.

| | |
|---|---|
| **A replayable source** | Kafka, files — ask again by offset |
| **Deterministic computation** | same input, same output |
| **An idempotent sink** | writing twice = writing once |

That third one is **not Spark's to give.**

### Because a retried batch really does write twice
Replay gives you *at-least-once* delivery. The sink is what turns it into exactly-once — or doesn't.

### How a sink can manage it
- **File sink** — a manifest of committed files; uncommitted ones are ignored
- **A transactional table** — one atomic commit per batch
- **\`foreachBatch\` + \`MERGE\`** — upsert on a key, using the batch id

> \`foreachBatch\` is the escape hatch for any sink without native support: you get a normal DataFrame and a batch id, and you make the write idempotent yourself. If you ignore the batch id, you have at-least-once and should say so.`,
  narration:
    "Exactly-once processing is the guarantee everyone wants, and it's worth being precise about what it requires, because Spark cannot deliver it alone. Three things are needed. A replayable source — one you can ask again for a specific range, by offset. Kafka is replayable. A file source is replayable. A socket is not. Deterministic computation, so that replaying the same input produces the same output. And an idempotent sink: writing the same data twice must have the same effect as writing it once. Spark provides the first two. The third is not Spark's to give. And the reason this matters is that a retried batch genuinely does write twice. Replay gives you at-least-once delivery: if a batch fails after writing some output but before committing, the retry writes that output again. What turns at-least-once into exactly-once is the sink refusing to double-count. Three ways a sink can manage it. The file sink keeps a manifest of committed files, so files from a failed attempt are simply ignored by readers. A transactional table format commits each batch atomically — either the whole batch is visible or none of it is. And foreachBatch lets you do it yourself: you receive a normal DataFrame and a batch id, and you write with a MERGE keyed on something unique, so a repeat is a no-op. That last one is the escape hatch for any sink without native support — a relational database, an API, anything. And the honest note: if you use foreachBatch and ignore the batch id, you have at-least-once, not exactly-once. That's often fine. It should just be a decision rather than an accident.",
}

export const eventTime: Section = {
  id: 'event-time',
  title: 'Two clocks',
  scene: 'str-event-time',
  focus: 'rule',
  slide: `## Two clocks

| | |
|---|---|
| **Event time** | when it *happened* — a column in the row |
| **Processing time** | when Spark *saw* it — an accident of the day |

They're usually close. **The gap is where the difficulty of streaming lives.**

### Why they come apart
- A phone was **offline** — events arrive hours late
- A broker **retried** — out of order, not just late
- The job was **restarted** — an hour of backlog, all at once

Every one of those is ordinary operation, not a malfunction.

### So aggregate on event time
Processing time gives an answer that depends on **when the job happened to run** — which is not an answer. Restart the job and yesterday's numbers change.

\`\`\`python
df.groupBy(window("event_ts", "10 minutes")).count()
\`\`\`

> The cost of being right: Spark must now keep windows open for rows that haven't arrived. That's the state problem the next two sections solve.`,
  narration:
    "Here is where streaming stops being batch-with-extra-steps, and it's about time. There are two clocks. Event time is when something actually happened — the moment a user clicked, a sensor read, a transaction completed. It's a column in the row, written by whatever produced the event. Processing time is when Spark saw it. That's an accident of the day: of network conditions, of whether a job was running, of how far behind a consumer was. Most of the time those two are close, within a second or two. And the gap between them is where all the difficulty of streaming lives. Why do they come apart? A phone was in a tunnel with no signal, and its events arrive four hours later. A message broker retried a delivery, so events arrive out of order, not merely late. Your job was down for maintenance, and when it starts, an hour of backlog arrives at once — with event times spread across that hour, all processed in the same second. Every one of those is ordinary operation, not a failure. So you aggregate on event time. Because if you aggregate on processing time, you get an answer that depends on when the job happened to run, which is not really an answer at all. Restart the job to fix something, and yesterday's numbers change. Event time gives you a result that's the same no matter when or how many times you process it. That's the property you actually want. But it has a cost: Spark now has to keep windows open, waiting for rows that might still arrive. And keeping things open is state. That's the problem the next two sections solve.",
}

export const windows: Section = {
  id: 'windows',
  title: 'Windows: bounding an unbounded question',
  scene: 'str-windows',
  focus: 'kinds',
  slide: `## Windows

An unbounded stream needs a **bounded question.**

*"How many events?"* has no answer — it's still going up. *"How many in the 10 minutes to 09:10?"* has one.

### Three shapes
| | |
|---|---|
| **Tumbling** | fixed, no overlap — a row lands in **one** window |
| **Sliding** | overlapping — a row counts in **several** |
| **Session** | grows with activity, closes after a gap of inactivity |

\`\`\`python
window("ts", "10 minutes")              # tumbling
window("ts", "10 minutes", "5 minutes") # sliding
session_window("ts", "30 minutes")      # session
\`\`\`

### The cost differs, and it's not obvious
A 10-minute window sliding every minute means each row is counted in **ten** windows — ten times the state, ten times the update work.

### And each open window is state
Which is why a window that never closes is a leak.

> Session windows are the most expensive: the window's *end* isn't known until the gap has passed, so nothing can be finalised early.`,
  narration:
    "Once you're working in event time, you need windows, because an unbounded stream needs a bounded question. How many events have there been? There's no answer — the number is still going up, and any value you give is instantly wrong. How many events were there in the ten minutes ending at nine-ten? That has a definite answer, and it stops changing once enough time has passed. There are three shapes. Tumbling windows are fixed and don't overlap: nine to nine-ten, nine-ten to nine-twenty, and so on. Every row lands in exactly one. Sliding windows overlap: a ten-minute window computed every minute, so at any moment ten windows are open and each row is counted in all ten. Session windows are different in kind — they grow while activity continues and close after a gap of inactivity, which is how you model a user's visit rather than a clock interval. The cost difference is worth spelling out, because it's not obvious from the API. A tumbling window means one state entry per key per window. A ten-minute window sliding every minute means each row contributes to ten windows, so you have ten times the state and ten times the update work for the same input. That's a real multiplier and people walk into it. Session windows are the most expensive of all, because the window's end isn't known until the inactivity gap has actually elapsed — so nothing can be finalised early, and state has to be held speculatively. The unifying point: every open window is state. Which means a window that never closes is a memory leak with a schedule.",
}

export const watermarks: Section = {
  id: 'watermarks',
  title: 'Watermarks: the promise that lets state be dropped',
  scene: 'str-watermarks',
  focus: 'trade',
  slide: `## Watermarks

**When can a window be closed and its state dropped?**

Never — without a rule. A row for 09:00 might still turn up tomorrow, so in principle every window must stay open forever.

### A watermark is a promise you make about lateness
\`\`\`python
df.withWatermark("event_ts", "10 minutes")
\`\`\`
*"Nothing more than 10 minutes late matters to me."*

Spark subtracts that threshold from the **latest event time it has seen**, and drops state for windows the result has passed.

### And it forces a trade you have to make explicitly
| | |
|---|---|
| **Too short** | late rows **silently dropped** |
| **Too long** | state grows, latency grows |

There's no setting that gives both. The honest answer is a number chosen by measuring **how late your data actually is** — not a default copied from a tutorial.

> It advances on the *data*, not the clock. If the stream goes quiet, the watermark stops moving and windows stay open.`,
  narration:
    "Watermarks are the part of streaming people find hardest, and I think it's because they're usually introduced as a setting rather than as an answer to a question. So here's the question. When can a window be closed and its state thrown away? And the honest answer, without further information, is never. A row with an event time of nine o'clock this morning might turn up tomorrow — from a phone that was offline, from a broker that was backed up. So in principle every window must stay open forever, and your state grows without bound until the job dies. A watermark is how you make that answerable. You declare: nothing more than ten minutes late matters to me. That's a promise about your data, and it's yours to make, because only you know what your sources do. Spark takes the latest event time it has seen, subtracts your threshold, and that's the watermark. Any window that ended before the watermark is finished — no more rows for it will be accepted — so its state can be dropped and its result emitted. Now the trade, and this is the part to make explicitly rather than by default. Too short a watermark and genuinely late rows are silently discarded; your counts are quietly wrong and nothing tells you. Too long and state grows, memory grows, and in append mode your latency grows too, because results can't be emitted until the window closes. There is no setting that gives you both, and choosing ten minutes because a tutorial said ten minutes is not choosing. Measure how late your data actually is. One subtlety worth knowing: the watermark advances on the data, not on the wall clock. If your stream goes quiet, the watermark stops moving and nothing closes.",
}

export const theStateStore: Section = {
  id: 'the-state-store',
  title: 'The state store',
  scene: 'str-state-store',
  focus: 'watch',
  slide: `## The state store

Where a running aggregate actually lives. Partitioned by the grouping key, versioned per batch, and written to the checkpoint so a restart can resume.

| | |
|---|---|
| **In the executor** | for speed, during the batch |
| **In the checkpoint** | for survival, between them |

### Two providers, and the choice is about size
| | |
|---|---|
| **HDFS-backed** *(default)* | all state in the **JVM heap** — GC pressure grows with it |
| **RocksDB** | spills to local disk — for large state |

\`\`\`
spark.sql.streaming.stateStore.providerClass
\`\`\`
If your state is a few million keys, the default is fine. If it's hundreds of millions, the default becomes a GC problem long before it becomes a memory error.

### The number to watch, from day one
\`numRowsTotal\` in the query progress output.

**If it only ever rises, something never expires** — a missing watermark, or a key space that grows forever. Catch that in week one, not in month six when the job stops restarting successfully.`,
  narration:
    "Let's look at where state actually lives, because it's the thing most likely to end a streaming job that's been running happily for months. State is partitioned by the grouping key, exactly as shuffled data is — so the state for a given key always lives on the executor handling that key's partition. It's versioned per batch, which is what allows a restart to roll back to a consistent point. And it's written to the checkpoint, which is how it survives a restart at all. So it lives in two places: in the executor for speed during a batch, and in the checkpoint for survival between them. There are two implementations. The default keeps all state in the JVM heap, backed by files in the checkpoint. That's simple and fast, and it works well until your state gets large — at which point you have hundreds of millions of objects on the heap, and the garbage collector becomes your bottleneck long before you actually run out of memory. RocksDB is the alternative: an embedded key-value store that keeps hot state in memory and spills the rest to local disk. For large state it's substantially better, because the JVM heap stops growing with your key count. Now the number I'd most like you to watch, from the first day a streaming job goes live. In the query progress output there's a field called numRowsTotal, which is how many rows are in the state store. Watch its trend. If it only ever rises, something never expires — a missing watermark, or a key space that grows forever, like session ids that are never reused. Catch that in week one. The alternative is discovering it in month six, when the job stops being able to restart because loading state takes longer than the trigger interval.",
}

export const streamStreamJoins: Section = {
  id: 'stream-stream-joins',
  title: 'Stream-stream joins',
  scene: 'str-stream-joins',
  focus: 'need',
  slide: `## Stream-stream joins

Neither side is finished, so **neither can be the build side.** A row on the left may match one on the right that hasn't arrived yet.

### So both sides are buffered in state
Every unmatched row is kept in case its partner turns up. Without a bound, that's **every row, forever.**

### Which is why Spark demands two things
| | |
|---|---|
| **A watermark on *both* sides** | how late each may be |
| **A time bound in the \`ON\`** | *clicks within an hour of the impression* |

Together they cap how long a row can usefully be kept — and therefore the state.

> Outer joins need more: a null result can only be emitted once Spark is sure no match will arrive, so the watermark also decides when a **non-match** is final.`,
  narration:
    "Stream-stream joins are the most demanding thing in Structured Streaming, and understanding why makes the constraints feel reasonable rather than arbitrary. Recall how a batch join works: one side is the build side, held in memory, and the other is streamed past it. That requires one side to be finished, so you know you've got all of it. In a stream-stream join, neither side is finished. Ever. A row arriving on the left might match a row on the right that hasn't been produced yet. So neither can be the build side, and you can't simply discard a row because it didn't match — its partner might be five minutes away. So Spark buffers both sides in state. Every unmatched row is kept, in case its partner turns up. And without a bound on that, you're keeping every row from both streams, forever, which fails quickly. Which is why Spark refuses to run one unless you give it two things. First, a watermark on both sides, declaring how late each stream may be. Second, a time bound inside the join condition itself — not just that the ad ids match, but that the click happened within an hour of the impression. Together those put a ceiling on how long any row could usefully be kept: once the watermark has moved past the latest time a match could occur, that buffered row can be dropped. State stays bounded. One extra wrinkle for outer joins. An outer join has to emit a null result for a row that never matched — but Spark can only do that once it's certain no match will ever arrive. So the watermark is doing double duty: it decides when state can be dropped, and it decides when a non-match becomes final. Which means your unmatched rows arrive late, by design, by exactly the watermark delay.",
}
