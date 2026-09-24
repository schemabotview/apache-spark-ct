import type { Section } from '../types'

export const fiveProperties: Section = {
  id: 'five-properties',
  title: 'An RDD is five properties',
  scene: 'rdd-five-properties',
  focus: 'claim',
  slide: `## An RDD is five properties

Smaller than its reputation. **A description of how to produce data — not the data.**

### Three every RDD must have
| | |
|---|---|
| **A list of partitions** | the pieces it splits into |
| **A compute function** | how to produce *one* partition |
| **Its dependencies** | which parent RDDs it was built from |

### Two that are optional
- **A partitioner** — how keys map to partitions, if it's keyed
- **Preferred locations** — where each partition would rather run

Both are hints to the scheduler. They change *where* work is placed, never *what* it computes.

### That's the entire abstraction
No rows are stored. Nothing is materialised. An RDD holds a **recipe** and a **shape**.

Every famous Spark behaviour — laziness, fault tolerance, the shuffle, data locality — falls out of one of those five.`,
  narration:
    "Resilient Distributed Dataset. The name is intimidating and the idea is small, so let's take it apart. An RDD is five properties. Three are mandatory. First, a list of partitions — the pieces this collection splits into. Second, a compute function that says how to produce one partition, given its parents. Third, a list of dependencies: which parent RDDs this one was built from. Two more are optional. A partitioner, which says how keys map to partitions, and only exists if the data is keyed. And preferred locations, which say where each partition would rather be computed. Both of those are hints to the scheduler — they change where work gets placed, never what it computes. And that is genuinely the whole abstraction. Notice what isn't in the list: the data. An RDD doesn't store rows. Nothing is materialised when you create one. What it holds is a recipe — how to make each piece — and a shape — how many pieces there are. That's why you can define an RDD over a dataset far larger than your cluster's memory, and nothing happens. The reason this list is worth memorising is that every famous Spark behaviour falls out of one of the five. Laziness comes from the compute function not having been called. Fault tolerance comes from dependencies. The shuffle comes from what happens when the partitioner has to change. Data locality comes from preferred locations. For the rest of this course we're going to walk that list, and each one will explain a thing you've probably already run into.",
}

export const thePartition: Section = {
  id: 'the-partition',
  title: 'The partition is the unit of everything',
  scene: 'rdd-partition',
  focus: 'ceiling',
  slide: `## The partition is the unit of everything

One logical collection, many physical pieces. You write code against the whole thing; Spark runs it **once per partition**.

A partition is the unit of:
- **Parallelism** — one task processes exactly one partition
- **Placement** — it lives on one machine at a time
- **Recovery** — it's what gets recomputed when a node dies

### Parallelism is the smaller of two numbers
\`min(partitions, task slots)\`. 1000 partitions on 4 cores is still **4 at a time**. 4 partitions on a 200-core cluster wastes 196.

### Where the count comes from
| | |
|---|---|
| **On read** | file size ÷ 128 MB |
| **After a shuffle** | \`spark.sql.shuffle.partitions\` (200) |
| **When you say so** | \`repartition\` · \`coalesce\` |

Both defaults know nothing about your data.`,
  narration:
    "The partition is the single most important unit in Spark, because it's the unit of three different things at once. Your data is one logical collection, split into many physical pieces. You write code against the whole collection — filter this, map that — and Spark runs that code once per partition, in parallel. First, it's the unit of parallelism. One task processes exactly one partition. Not half of one, not two. So the number of partitions is the maximum number of things that can happen simultaneously. Second, it's the unit of placement. A partition lives on one machine at a time. That's what makes a join expensive: two rows that need to meet might be in partitions on different machines. Third, it's the unit of recovery. When a node dies, Spark doesn't rebuild your dataset — it rebuilds the specific partitions that were lost. Now, the arithmetic people get wrong. Your actual parallelism is the smaller of two numbers: how many partitions you have, and how many task slots exist. A thousand partitions on a four-core laptop still runs four at a time — the other nine hundred and ninety-six queue. And four partitions on a two-hundred-core cluster uses four cores and wastes the rest, no matter how much you paid for them. Where does the count come from? It changes constantly, which surprises people. When you read files, it's roughly the total size divided by a hundred and twenty-eight megabytes. After any shuffle, it's spark dot sql dot shuffle dot partitions, which defaults to two hundred. And it's whatever you say if you call repartition or coalesce. Both of those defaults are fixed numbers that know nothing whatsoever about your data.",
}

export const immutability: Section = {
  id: 'immutability',
  title: 'Nothing is ever modified',
  scene: 'rdd-immutability',
  focus: 'chain',
  slide: `## Nothing is ever modified

\`rddB = rddA.filter(...)\` doesn't change \`rddA\` — it records that \`rddB\` **is** \`rddA\` with a filter applied.

### What immutability buys
- **No locking** — nothing can be written, so nothing needs guarding
- **Safely recomputable** — same inputs, same answer
- **Freely shareable** — two branches can read one parent

That middle one is load-bearing: **recovery by recomputation is only correct if recomputation is deterministic.**

### Where it leaks
\`\`\`
rdd.map(lambda x: x * random())
\`\`\`
Spark can't tell this isn't deterministic. On recovery you get *different data* — silently.

> A property Spark relies on. Not one it can enforce inside your function.`,
  narration:
    "In Spark, data structures are immutable. Nothing is ever modified in place. When you write rddB equals rddA dot filter, you have not changed rddA at all. You've created a new description that says: rddB is what you get if you take rddA and apply this filter. rddA is untouched and still usable. This sounds like a functional-programming nicety and it's actually load-bearing infrastructure. Three things come from it. First, no locking. If nothing can be written, nothing needs to be guarded, and a huge category of distributed concurrency bugs simply cannot occur. Second — and this is the important one — recomputation is safe. Because a transformation is a pure description, running it again on the same input gives the same output. Third, sharing is free. Two different branches of your job can both read from one parent RDD with no coordination between them. Now, hold on to that second point, because the next section depends on it completely. Spark's entire fault-tolerance story is: if we lose data, we'll just recompute it. That's only correct if recomputing genuinely reproduces what was there. Immutability is most of what guarantees it. But here's where it leaks, and it's worth knowing. Spark cannot look inside your function. If you write a map that multiplies by a random number, or one that reads the current time, or one that writes a row to an external database, Spark has no way to know it isn't deterministic. It will happily recompute it on failure, and you'll get different data than you had before — silently, with no error. Immutability is a property Spark relies on. It's not one Spark can enforce for you.",
}

export const lineage: Section = {
  id: 'lineage',
  title: 'Lineage: the plan is the backup',
  scene: 'rdd-lineage',
  focus: 'recover',
  slide: `## Lineage: the plan is the backup

Every RDD knows its parents. Follow those links back and you reach something **durable on disk**. That graph costs a few kilobytes on the driver.

### When a machine dies
1. Partition 2 is lost. **No replica exists** — and none is needed.
2. Spark reads the graph **backwards**: which parents fed it?
3. It recomputes **that path, for that one partition**

Not the RDD. Not the stage. Not the job.

| | |
|---|---|
| **MapReduce** | keeps the *data* safe — replicate always |
| **Spark** | keeps the *recipe* safe — free until needed |

### The cost nobody mentions
A graph hundreds of steps deep makes recovery expensive. That's what \`checkpoint()\` is for: write to durable storage and **cut the chain**.`,
  narration:
    "This is the idea that makes Spark's fault tolerance different from everything before it. Every RDD knows its parents. Follow those links backwards and you get a graph — a chain of operations reaching all the way back to something durable on disk, like a file. That graph is called the lineage, and it's built up on the driver as you write your transformations. It costs a few kilobytes of memory. Now watch what that buys. A machine dies mid-job, taking partition two with it. There's no replica of partition two anywhere. Under the old model that's a catastrophe, which is why MapReduce replicated everything three times. Under Spark, it's a lookup. Spark reads the lineage graph backwards and asks: which parent partitions fed partition two? It recomputes that path, for that one partition, and the job continues. Notice the precision there. It doesn't rebuild the RDD. It doesn't rerun the stage. It rebuilds exactly what was lost. The job gets slower by the cost of one partition, and nothing fails. So the contrast is: MapReduce kept the data safe by replicating it, and paid that cost on every write whether anything failed or not. Spark keeps the recipe safe, and remaking a recipe costs nothing until you actually need it. Now let me give you the cost nobody mentions, because it's real. If your lineage graph is hundreds of steps deep — which happens in iterative algorithms, a machine learning loop that runs two hundred iterations — then recovering one partition means replaying two hundred steps, and the graph itself becomes slow for the driver to handle. That is what checkpoint is for. Checkpoint writes an RDD to durable storage and cuts the lineage chain at that point. You're trading disk for a shorter graph, and it's the one situation where caching isn't the right answer.",
}

export const narrowDependency: Section = {
  id: 'narrow-dependency',
  title: 'Narrow dependencies, and the three things they buy',
  scene: 'rdd-narrow',
  focus: 'gifts',
  slide: `## Narrow dependencies

**Each output partition reads exactly one input.**

\`map\` · \`filter\` · \`flatMap\` · \`mapPartitions\` · \`union\`

No row ever needs to know about a row elsewhere. Partition 0 becomes 0′ on the same machine, start to finish.

### Three things this buys at once
| | |
|---|---|
| **Pipelining** | ten steps collapse into **one pass** |
| **No network** | work happens where the data is |
| **Cheap recovery** | one lost partition → **one** parent |

Filter-then-map-then-filter doesn't make three passes. Spark fuses them: read a row, apply all three, move on. **Nothing intermediate is materialised.**

> A single wide operation in the middle cuts the chain in two, and both halves pay the boundary.`,
  narration:
    "Dependencies come in exactly two kinds, and this distinction is the most useful thing in this course. A narrow dependency means each output partition reads exactly one input partition. Map, filter, flatMap, mapPartitions, union — all narrow. Picture partition zero on host A. Apply a filter, and you get a new partition zero-prime, built entirely from the old partition zero, still on host A. No row ever needed to know about a row anywhere else. Three things come from that, and they arrive together. First, pipelining. This one is bigger than people realise. If you write a filter, then a map, then another filter, Spark does not make three passes and build two intermediate collections. It fuses them into one: read a row, apply all three operations to it, move on to the next row. Nothing intermediate is ever materialised anywhere. Second, no network. The work happens where the data already sits, so nothing crosses the wire. Third, cheap recovery. If you lose one output partition, there's exactly one parent partition to recompute. One, not many. So Spark works quite hard to keep a run of operations narrow for as long as possible, because everything I just described is free until that run ends. And this is the practical bit: a single wide operation dropped in the middle of a narrow chain cuts it in two, and both halves pay for the boundary. If you have a filter that removes ninety percent of your rows, doing it before a groupBy rather than after it means ninety percent less data crosses the network. Same result, completely different cost. That's the whole skill.",
}

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

export const recomputeNotReplicate: Section = {
  id: 'recompute-not-replicate',
  title: 'Recompute, don’t replicate',
  scene: 'rdd-recompute',
  focus: 'condition',
  slide: `## Recompute, don't replicate

Two ways to survive losing a machine.

| | Cost | Paid |
|---|---|---|
| **MapReduce** | 3× storage and write traffic | **always** |
| **Spark** | a lineage graph, a few KB | **on failure**, for what was lost |

On a healthy cluster Spark pays nothing at all for fault tolerance.

### The condition that makes it work
**Every transformation must be deterministic.** Same input, same output — or recovery silently produces different data than it replaced.

Spark can't check this:
- No \`random()\`, no wall clock, no mutable external state
- A \`map\` with a side effect may run **twice**, or **not at all**

> Speculative execution runs the same task twice on purpose. Non-deterministic code makes that a race, not a redundancy.`,
  narration:
    "Let's make the fault-tolerance trade explicit, because it's a genuine engineering decision with two sides. MapReduce buys safety with copies. Every intermediate result gets written to HDFS and replicated, typically three times. Lose a machine and you've lost nothing, because two other copies exist. The cost is three times the storage and three times the write traffic, and — this is the key part — you pay it always. Every job, every step, whether or not anything ever fails. It's insurance with a premium on every transaction. Spark buys safety with a recipe. Instead of copies of the data, it keeps the lineage graph: a description of how each partition was made. That's a few kilobytes on the driver for an entire job. Lose a machine and Spark recomputes what was on it. So the cost is nearly zero normally, and you only pay on failure, and only for the partitions actually lost. On a healthy cluster, Spark pays nothing at all for fault tolerance. That's the trade, and it's a good one. But it rests on a condition, and I want to be direct about it because it can bite you in production without ever producing an error. Every transformation has to be deterministic. Same input, same output, every time. If it isn't, then recovery doesn't restore what was lost — it produces something different, silently. So: no random numbers inside a map, no reading the wall clock, no depending on mutable external state. And be careful with side effects — a map that writes a row to a database may run twice, or may not run at all, depending on what fails where. Spark makes no promise about that. In fact speculative execution deliberately runs the same task in two places at once to beat stragglers. If your function isn't deterministic, that isn't redundancy. It's a race.",
}

export const preferredLocations: Section = {
  id: 'preferred-locations',
  title: 'Data locality, and why tasks wait',
  scene: 'rdd-locality',
  focus: 'levels',
  slide: `## Data locality

The scheduler asks each partition **where it would rather run** — because moving a task is free and moving a partition is not.

| | |
|---|---|
| \`PROCESS_LOCAL\` | same JVM — **already cached** here |
| \`NODE_LOCAL\` | same machine — local disk read |
| \`RACK_LOCAL\` | same rack — short network hop |
| \`ANY\` | anywhere. Ship the data. |

### The behaviour that confuses people
If the ideal slot is busy, Spark **waits** rather than settling — \`spark.locality.wait\`, 3 s.

So a stage can show **idle slots** while tasks queue. It isn't stuck; it's betting 3 seconds beats moving a gigabyte.

> On cloud object storage \`NODE_LOCAL\` is often meaningless — this matters far less than it did on HDFS.`,
  narration:
    "The fifth property is preferred locations, and it's the one that explains a Spark UI behaviour people find baffling. When the scheduler is deciding where to run a task, it asks that task's partition where it would rather be computed. The reasoning is simple: a task is kilobytes of serialised code, and a partition is maybe a hundred megabytes of data. Moving the task is free. Moving the data is not. So send the task to the data. There's a hierarchy of how good a placement can be. Process-local is best: the partition is already cached in this very JVM, so there's no I/O at all. Node-local means the same machine but a different process — a local disk read, still fast. Rack-local means over the network but a short hop within the same rack. And ANY means anywhere at all: ship the data to wherever there's a free slot. Now here's the behaviour that confuses people. If the ideal slot is busy, Spark doesn't immediately settle for a worse one. It waits. There's a setting called spark dot locality dot wait, three seconds by default, and during that window Spark holds out hoping the good slot frees up. Which means you can look at the Stages tab and see idle executors while tasks are queued, and conclude something is broken. Nothing is broken. Spark is making a bet that waiting three seconds is cheaper than moving a gigabyte across the network. Usually it's right. The place to read this is the Locality Level column in the Stages tab. If everything says ANY, every task is pulling its input over the wire and locality has failed. One honest caveat: on cloud object storage, node-local is often meaningless, because compute and storage are genuinely separate services. So this matters far less today than it did when everyone ran HDFS on the same machines as their compute.",
}

export const pairRdds: Section = {
  id: 'pair-rdds',
  title: 'Pair RDDs: why the key changes everything',
  scene: 'rdd-pairs',
  focus: 'classic',
  slide: `## Pair RDDs

Just an RDD of \`(key, value)\` tuples. No new type — but the key is what every distributed operation is defined against.

Partitioning, grouping and joining are all one instruction: *put the same key in the same place.*

### The oldest optimisation in Spark
\`\`\`
rdd.groupByKey().mapValues(sum)
rdd.reduceByKey(lambda a, b: a + b)
\`\`\`
Identical answers. A million rows over a hundred keys:

| | Crosses the network |
|---|---|
| \`groupByKey\` | **1,000,000** values |
| \`reduceByKey\` | **~100** per partition |

The second combines *within* each partition first — a **map-side combine**.

> In the DataFrame API you don't get to make this mistake: the optimizer always combines.`,
  narration:
    "A pair RDD is an RDD of two-element tuples. Key and value. There's no special class and no new type — if your elements happen to be tuples, Spark makes a set of extra operations available. But the key matters more than that framing suggests, because the key is what every distributed operation is defined against. Think about what partitioning, grouping and joining actually have in common. Every one of them is the same instruction: put the same key in the same place. Hash the key, send it to a partition. Group by key: same place. Join on key: same place. Repartition by key: same place, explicitly. All of it needs a key to exist. Which is why groupByKey, reduceByKey, aggregateByKey, join, cogroup and partitionBy all live on pair RDDs and nowhere else. Now let me show you the oldest optimisation in Spark, because it's still the clearest illustration of why any of this matters. Say you want a total per key. You could call groupByKey and then sum the values. Or you could call reduceByKey with an addition function. Same answer, both correct. Here's the difference. GroupByKey moves every single row across the network and then combines. With a million rows over a hundred keys, a million values cross the wire. ReduceByKey combines within each partition first — so each partition sends at most one value per key it saw, maybe a hundred values instead of a million. That's called a map-side combine, and it's the same idea as a combiner in MapReduce. Ten thousand times less network traffic for an identical result. And here's the closing point. In the DataFrame API you don't get to make this mistake, because the optimizer always does the combine for you. That's one of the clearest reasons the structured API beats hand-written RDD code: it doesn't forget.",
}

export const whenRddsWin: Section = {
  id: 'when-rdds-still-win',
  title: 'When to use RDDs directly: rarely',
  scene: 'rdd-when-still',
  focus: 'still',
  slide: `## When to use RDDs directly

**The default answer is: don't.** Understand them — everything is built on them. Write against DataFrames.

### What you give up
An RDD is **opaque to the optimizer**. A lambda is a black box, so Spark runs exactly what you wrote.

- **No Catalyst** — no pushdown, no reordering, no column pruning
- **No Tungsten** — JVM objects, not compact binary rows
- **No AQE** — nothing re-plans at runtime

In PySpark it's worse: RDD ops serialise every row to a Python process.

### What still justifies them
- **Truly unstructured input** — before any schema exists
- **You need the partitioner** — custom placement
- **Per-partition control** — one DB connection per partition

> Not deprecated, and not going away. Just no longer where you should be writing.`,
  narration:
    "Let's close with the practical question: should you write RDD code? Almost always, no. Understand RDDs, because everything in Spark is built on them and the vocabulary is everywhere. But write against DataFrames. Here's the concrete reason. An RDD is opaque to the optimizer. When you pass a lambda to map, that function is a black box — Spark cannot see inside it, cannot know which columns it touches, cannot tell whether it filters anything. So it does exactly what you wrote, in the order you wrote it. Three things you lose. Catalyst can't optimise: no predicate pushdown, no reordering, no column pruning, because it doesn't know what your function does. Tungsten can't help: you get JVM objects rather than compact binary rows, which costs memory and garbage collection. And adaptive query execution has nothing to re-plan. In PySpark it's worse still, because RDD operations serialise every row out to a Python process and back, whereas DataFrame operations stay inside the JVM entirely. So when do RDDs still earn their place? Three cases, and they're narrow. Truly unstructured input — you're parsing something strange before any schema exists, and there's nothing for a DataFrame to be. Second, when you need control of the partitioner, placing data in a specific custom way the DataFrame API won't express. And third, per-partition control: mapPartitions lets you do setup once per partition rather than once per row, which is how you open a single database connection for a whole partition instead of a million connections. Each of those is something the structured API genuinely cannot express, not a stylistic preference. And to be clear — the RDD API isn't deprecated and isn't going anywhere. It's the layer everything else compiles down to. It's just no longer the layer you should be writing at.",
}
