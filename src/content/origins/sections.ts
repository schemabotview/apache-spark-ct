import type { Section } from '../types'

export const theSingleMachine: Section = {
  id: 'the-single-machine',
  title: 'Where one machine stops',
  scene: 'origins-single-machine',
  focus: 'wall',
  slide: `## Where one machine stops

Spark exists because of a **hardware** fact, not a software fashion.

### The free lunch
For thirty years, the same program got faster every year. Clock speeds rose; nobody changed any code. **1995: 100 MHz. 2005: 3 GHz.**

### Then it stopped
Not ambition — **physics**. Power and heat rise faster than clock speed, so making a single core faster stopped paying.

### The industry turned sideways
- More **cores** at the same speed, then more **machines**
- A single-threaded program gets **nothing** from either
- The cost of going faster moved out of the hardware and **into your program**

> That's the shift Spark is an answer to: the hardware stopped solving the problem for you.`,
  narration:
    "It's worth starting with why any of this exists, because Spark isn't a fashion — it's a response to something that happened to hardware. For about thirty years, programmers had what people later called a free lunch. You wrote a program, and next year it ran faster. The year after, faster again. You changed nothing. Processor clock speeds kept climbing — a hundred megahertz in the mid-nineties, a gigahertz by 2000, three gigahertz by about 2005 — and every program on earth got faster for free. Then it stopped. And it stopped for a reason nobody could engineer around: physics. Power consumption and heat output rise much faster than clock speed does, so pushing a single core faster stopped being worth it. The chip would melt, or cost more in electricity than it saved in time. So the industry turned sideways instead. Rather than one core getting faster, you got more cores at the same speed. Then more sockets. Then more machines. Here's the uncomfortable part: a single-threaded program gets absolutely nothing from any of that. Four cores don't make it four times faster. They make it exactly as fast as before, with three cores idle. The cost of going faster moved out of the hardware and into your program — somebody now has to write code that splits work across cores, and then across machines, and handles the parts that go wrong. That's the shift. Everything in this course is about a system built to make that somebody's job survivable.",
}

export const shipCodeToData: Section = {
  id: 'ship-code-to-data',
  title: 'Ship the code to the data',
  scene: 'origins-ship-code',
  focus: 'new',
  slide: `## Ship the code to the data

The idea that makes distributed data processing possible at all — and it's one inversion.

### The old shape
Data lives in a storage array. The program runs on a server. To compute, you **pull the data to the program**.

Fine at gigabytes. At a terabyte over a gigabit link, that's **hours before any work starts.**

### The inversion
Your program is **kilobytes**. Your data is **terabytes**.

**So move the small thing.** Split the data across machines, and send a copy of the program to each one. Each machine reads only its own local block.

- Google, 2003–04: **GFS** and **MapReduce**
- Yahoo's open implementation: **HDFS** and Hadoop MapReduce, Apache 2006

> The network stops being the bottleneck, because almost nothing crosses it.`,
  narration:
    "So work has to be split across machines. But there's a problem that has to be solved before that can work at all, and the solution is one of those ideas that seems obvious only after you've heard it. Think about the traditional shape of computing. Your data lives somewhere — a database, a storage array. Your program runs somewhere else — an application server. To compute anything, you pull the data across the network to where the program is. That's fine when the data is megabytes. It's fine at gigabytes. But picture a terabyte, moving over a gigabit network link. That's hours of transfer before a single useful instruction runs. And you'd do it again tomorrow. Now look at the two things involved. Your program — the actual logic — is tiny. A few kilobytes of compiled code. Your data is enormous. So why are we moving the enormous thing to the tiny thing? Invert it. Split the data across many machines, so each one holds a block of it on its own local disk. Then send a copy of the program to every machine. Each one reads only its own block, from its own disk, at local disk speed, with nothing crossing the network at all. That's ship the code to the data, and it's the foundation everything else sits on. Google published it in 2003 and 2004, as the Google File System and MapReduce. Yahoo built an open implementation, which became HDFS and Hadoop MapReduce, and it landed at Apache in 2006. Spark did not invent this. Spark inherited it — and then changed one specific thing about it.",
}

export const theDiskTax: Section = {
  id: 'the-disk-tax',
  title: 'The disk round-trip that Spark exists to remove',
  scene: 'origins-disk-tax',
  focus: 'chain',
  slide: `## The disk round-trip

MapReduce's model is rigid: **map, then reduce.** One pass. Any real algorithm is many passes chained together.

### What happens between the passes
Every step **writes its entire output to HDFS** — to disk, then replicated across the network for durability — and the next step **reads it all back**.

\`\`\`
step 1 → [write ×3, read back]
       → step 2 → [write ×3, read back]
       → step 3
\`\`\`

A three-step job pays that twice. A hundred-step job pays it ninety-nine times.

### Who this hurts most
| | |
|---|---|
| **Machine learning** | the same data, 100 iterations |
| **Graph algorithms** | PageRank, until it converges |
| **Interactive queries** | a full re-read for every question you ask |

Anything whose steps are a **loop** rather than a line. Which is most of the interesting ones.

> Spark's entire origin is: *what if that round-trip didn't have to happen?*`,
  narration:
    "Hadoop MapReduce worked, and at the time it was a genuine breakthrough. But it had one characteristic that turned out to matter enormously, and understanding it is understanding why Spark exists. MapReduce gives you a rigid shape: a map phase, then a reduce phase. That's one pass. Real algorithms are almost never one pass — they're many passes chained together. So you write step one as a MapReduce job, step two as another, step three as another. And here's the cost. Between every pair of steps, the output of the first is written to HDFS in full. Not to memory — to disk. And because HDFS is designed for durability, it's replicated, typically three times, which means it also crosses the network. Then the next step starts by reading all of that back off disk again. A three-step job pays that round-trip twice. A hundred-step job pays it ninety-nine times. Now think about which algorithms that punishes. Machine learning: you make a hundred passes over the same data, refining parameters each time. Every single pass reads the whole dataset from disk again, even though it's identical data. Graph algorithms like PageRank iterate until they converge — same problem. Interactive analysis is worse still: you ask a question, wait, look at the answer, ask a follow-up, and Spark's predecessors re-read the entire dataset from scratch for every question. The pattern is that anything whose steps form a loop rather than a straight line pays this over and over. And loops are where the interesting work is. So the question that started Spark was simply: what if that round-trip didn't have to happen?",
}

export const theEngineZoo: Section = {
  id: 'the-engine-zoo',
  title: 'The engine zoo',
  scene: 'origins-engine-zoo',
  focus: 'zoo',
  slide: `## The engine zoo

If one general engine is slow for your workload, the obvious fix is a **specialist engine**. So the ecosystem grew one per workload.

| | |
|---|---|
| **Hive** | SQL over MapReduce |
| **Storm** | stream processing |
| **Impala** | interactive SQL |
| **Giraph** | graph processing |
| **Mahout** | machine learning |
| **Drill** | ad-hoc queries |

Each one was **good at its job.** That isn't the problem.

### The problem was the borders
- A separate **API** to learn, per engine
- A separate **cluster** to operate, tune and be paged about
- A separate **failure model** — they all broke differently
- And a pipeline crossing three of them **wrote to disk at every hop**, because they had nothing else to share

> Nobody has one workload. Real pipelines cross four of these before breakfast.`,
  narration:
    "There's a second consequence of that round-trip, and it shaped the whole ecosystem. If one general-purpose engine is too slow for your particular workload, the obvious response is to build a specialist engine for it. And that's exactly what happened, repeatedly. If you wanted SQL, you used Hive, which compiled queries into MapReduce jobs. If you needed streaming, Storm. Interactive SQL that didn't take minutes? Impala. Graph processing? Giraph. Machine learning? Mahout. Ad-hoc queries? Drill. Each of these was genuinely good at the thing it was built for, and I don't want to be unfair to them — that's not the problem. The problem was that nobody has one workload. A real data pipeline reads some files, cleans them with SQL, joins in a stream of events, trains a model, and writes a result. That's four engines. Which meant four different APIs your team had to learn, four separate clusters to install and tune and get paged about at three in the morning, and four different failure models, because they all broke in their own distinctive ways. And worst of all, look at the borders between them. Hive can't hand an in-memory dataset to Mahout. They share nothing. So every handoff went through disk — write the whole intermediate result out in one engine's format, read it back in another's. You paid the round-trip from the last section again, at every boundary, on top of paying it inside each engine. The zoo wasn't a design. It was what happens when the shared layer isn't good enough to share.",
}

export const theBet: Section = {
  id: 'the-bet',
  title: 'The bet: keep two things, change one',
  scene: 'origins-the-bet',
  focus: 'change',
  slide: `## The bet: keep two things, change one

UC Berkeley's AMPLab, 2009. The insight wasn't that MapReduce was wrong. It was that **only one part of it was.**

### Keep
- **Data parallelism** — partition the data, run the same code on each part
- **Fault tolerance** — a node dies, its work is redone, the job survives

Both were right. Neither needed replacing.

### Change
**Keep intermediate results in memory between steps**, instead of writing them to disk.

### What falls out
Iteration becomes cheap; queries come back in seconds.

And it stays fault-tolerant by **lineage** — remember how a partition was computed, recompute it if lost. MapReduce bought that with disk; a recipe is free.

> Early results: **10–20×** — a different set of programs you can write at all.`,
  narration:
    "In 2009, at Berkeley's AMPLab, a group including Matei Zaharia looked at this and made a bet. And the shape of the bet is what I'd like you to take away, because it's a good piece of engineering judgement. They didn't conclude MapReduce was wrong. They concluded that two of its three big ideas were right and should be kept. Keep data parallelism — partition the data, run the same code on every partition. That works. Keep fault tolerance — when a machine dies mid-job, and at scale one always does, the system recovers without a human. That works too. Change exactly one thing: stop writing intermediate results to disk between steps, and keep them in memory instead. Now, the obvious objection is that MapReduce wasn't writing to disk out of stupidity. It was writing to disk to get fault tolerance. If a node dies and its data was only in memory, that data is gone. So how do you keep both? The answer is lineage, and it's the genuinely clever part. Spark doesn't remember the data — it remembers how the data was made. Every partition knows the chain of operations that produced it, all the way back to something durable on disk. If a machine dies, Spark looks at that recipe and recomputes just the lost partitions. Fault tolerance without replication, and remembering a recipe is essentially free. What falls out is bigger than a speedup. Early benchmarks were ten to twenty times faster, but the real change is qualitative: loops become cheap, so iterative machine learning becomes practical, and queries come back in seconds, so you can actually explore data by asking follow-up questions. That's not a faster MapReduce. It's a different set of programs you can write at all.",
}

export const oneEngine: Section = {
  id: 'one-engine',
  title: 'One engine, four libraries',
  scene: 'origins-one-engine',
  focus: 'core',
  slide: `## One engine, four libraries

Remove the disk round-trip and the reason for the zoo disappears. The specialists collapse back into **libraries over one core.**

| Library | Replaces |
|---|---|
| **Spark SQL** | Hive, Impala |
| **Structured Streaming** | Storm |
| **MLlib** | Mahout |
| **GraphX** | Giraph |

### Why sharing the layer below is the whole point
All four compile down to **the same DAG of tasks**. One scheduler, one memory model, one failure model.

So a SQL read feeding an ML model isn't two systems handing files to each other. It's **one plan**, and the engine optimizes across the boundary:

- The handoff stays **in memory** — no disk at the borders
- A filter written after a join can be **moved into the scan** beneath it

### And one more thing it unified
Scala, Java, Python, R and SQL all produce the same plan. On the structured APIs, **the language you write in stops affecting performance.**`,
  narration:
    "Once you've removed the disk round-trip, something interesting happens to the zoo: the reason for it evaporates. Those specialist engines existed because the shared layer underneath was too slow to share. Make the shared layer fast, and they don't need to be separate systems any more — they can be libraries. So that's what Spark is. Spark SQL does what Hive and Impala did. Structured Streaming does what Storm did. MLlib replaces Mahout. GraphX replaces Giraph. But calling them libraries rather than engines is the whole point, and it's worth being precise about why. All four of them compile down to exactly the same thing: a DAG of tasks, run by one core engine, with one scheduler, one memory model, and one failure model. So when you read a table with SQL and feed it into a machine learning model, that is not two systems handing a file to each other. It's a single plan. The handoff never touches disk, because it never leaves the engine. And better, the optimizer can see across the boundary — a filter you wrote after a join can be pushed down into the file scan underneath it, because both sides are the same kind of object. That's not something you can do when Hive hands a Parquet file to Mahout. One more unification worth mentioning, because it surprises people. Scala, Java, Python, R and SQL all produce the same plan. On the structured APIs, the language you write in stops affecting performance — your Python describes a result, the engine executes it on the JVM, and it runs the same as if you'd written Scala. There's an important exception when you drop to Python user-defined functions, but that's a story for another course.",
}

export const computeNotStorage: Section = {
  id: 'compute-not-storage',
  title: 'Spark deliberately owns no storage',
  scene: 'origins-compute-not-storage',
  focus: 'spark',
  slide: `## Spark deliberately owns no storage

The most consequential thing about Spark's design is something it **doesn't** do.

### Hadoop shipped both halves, welded
**HDFS** (storage) and **MapReduce** (compute) were one product. Taking one without the other didn't really work.

### Spark ships only the compute half
It reads and writes anything — \`S3 · HDFS · JDBC · Cassandra · Kafka\` — and owns **nothing** long-term.

### What the omission buys
Storage and compute **scale independently**. Keep a petabyte in object storage for cents; spin up a cluster for twenty minutes; kill it.

**This is why Spark outlived the Hadoop stack it was born inside.** When workloads moved to cloud object storage, Spark just pointed at it. HDFS was the thing being replaced.

### What it costs
No owner means **no guarantees** — no transactions, no schema enforcement, no atomic writes. Exactly the gap table formats later filled.`,
  narration:
    "Here's the design decision I'd argue matters most, and it's about something Spark deliberately doesn't do. Hadoop shipped two halves welded together: HDFS for storage, MapReduce for compute, as one product. They were co-designed and you couldn't sensibly take one without the other. Spark ships only the compute half. It reads from and writes to almost anything — S3, Azure Data Lake, Google Cloud Storage, HDFS, relational databases over JDBC, Cassandra, Kafka, Kinesis — and it owns none of it. There's a deliberate, carefully-shaped hole where a storage system would go. At the time that looked like an omission. It turned out to be the reason Spark is still here. Think about what it buys. Storage and compute scale independently. You can keep a petabyte sitting in object storage for a trivial monthly cost, spin up a big cluster for twenty minutes to run one job, and then destroy the cluster entirely. Under the Hadoop model, storing more data meant buying more machines, and those machines also ran compute whether you needed compute or not. The two were chained together. So when the industry moved to cloud object storage — which is most of what happened to data infrastructure in the 2010s — Spark simply pointed at the new thing and carried on. It didn't need rewriting, because it never assumed HDFS. HDFS, meanwhile, was the thing being replaced. Be honest about the cost, though. Owning no storage means guaranteeing nothing about it. A folder of Parquet files on S3 has no transactions, no schema enforcement, no atomic writes — if a job dies halfway, readers see the wreckage. That gap is precisely what table formats like Delta and Iceberg were later built to fill.",
}

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
