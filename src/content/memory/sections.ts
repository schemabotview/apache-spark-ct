import type { Section } from '../types'

export const theExecutorBudget: Section = {
  id: 'the-executor-budget',
  title: 'Where 16 GB actually goes',
  scene: 'mem-executor-budget',
  focus: 'sum',
  slide: `## Where 16 GB actually goes

\`spark.executor.memory = 16g\` is the **JVM heap**, and rather less than all of it is yours.

| Region | Size |
|---|---|
| **Reserved** | 300 MB, not negotiable |
| **The unified pool** | 60% of (heap − 300 MB) — execution *and* storage |
| **User memory** | the rest — your objects, UDF state |

### And a fourth region, outside the heap
\`spark.executor.memoryOverhead\` — thread stacks, network buffers, **Python workers**. The *container* must hold this, and **the kernel enforces it**, not the JVM.

### So: ask for 16 GB, get about 9 GB to work with
Which is why *"it has 16 GB, why did it OOM?"* is the wrong question.

> Exceed the heap → a Java \`OutOfMemoryError\`. Exceed the **container** → \`exit 137\`, no stack trace, nothing to catch.`,
  narration:
    "Let's start by dividing up what you actually asked for, because the arithmetic surprises people. You set executor memory to sixteen gigabytes. That number is the JVM heap size, and substantially less than all of it is available to your job. First, three hundred megabytes is reserved for Spark's own internal objects. That's fixed and not configurable in any way you should be using. Of what remains, sixty percent — that's spark dot memory dot fraction — becomes the unified pool. This is the interesting region, shared between execution and storage, and we'll spend most of this course on it. What's left, the other forty percent, is user memory. That's for objects your own code creates: anything you allocate inside a UDF, data structures you build in a mapPartitions. Spark doesn't manage it or track it. Then there's a fourth region, and it lives outside the heap entirely: memory overhead. Thread stacks, network buffers for shuffle transfers, and — if you're using PySpark — the Python worker processes. This memory is part of your container's allocation even though the JVM knows nothing about it. So do the arithmetic. Sixteen gigabytes, minus three hundred megabytes reserved, times sixty percent, gives you around nine gigabytes in the unified pool. And that's the number that matters for caching and for shuffles. This also explains two different failure modes. Exceeding the heap gives you a Java OutOfMemoryError, which Spark catches and reports. Exceeding the container gives you exit code one-three-seven, because the kernel killed the process, and there is no Java error at all.",
}

export const storageVsExecution: Section = {
  id: 'storage-vs-execution',
  title: 'Two uses, one pool',
  scene: 'mem-storage-vs-execution',
  focus: 'one',
  slide: `## Two uses, one pool

The unified pool serves two completely different needs.

### Execution — **transient**
Needed only while an operator runs, then released.
- Shuffle buffers (the map-side sort)
- Join hash tables (the build side)
- Sorts and aggregations accumulating state

### Storage — **durable**
Kept across operations, on purpose.
- Cached partitions
- Broadcast variables

### One pool, a soft boundary
They **share**, and the line between them moves at runtime.

Before Spark 1.6 they were two fixed pools with a wall between them, which meant an idle storage region couldn't help a starving shuffle. You tuned two numbers by hand, per job, and usually got it wrong.

> The sharing is the improvement. The *rule* for sharing is the next section, and it's the part that matters.`,
  narration:
    "That unified pool serves two completely different kinds of need, and keeping them straight explains most of what follows. Execution memory is transient. It's what an operator needs while it's running, and it's released the moment that operator finishes. Shuffle buffers, where the map side accumulates and sorts records before writing them out. Join hash tables, where the build side of a hash join lives. Sorts and aggregations, which accumulate state as rows flow through. All temporary, all scoped to one operation. Storage memory is durable. It's data you've deliberately asked Spark to keep across operations. Cached partitions, from calling cache or persist. And broadcast variables — the small side of a broadcast join sitting there ready to be probed. Those are different enough that you'd expect separate budgets, and historically there were. Before Spark one-point-six, there were two fixed pools with a fixed wall between them. A storage fraction and a shuffle fraction, both set by configuration in advance. And the problem was obvious once you'd hit it: if your job caches nothing at all, a large fraction of your memory sits idle while your shuffle spills to disk for want of it. Two numbers to tune, per job, and you almost always got them wrong. So Spark one-point-six unified them. One pool, and the boundary between execution and storage is soft — it moves at runtime as the two borrow from each other. That's the improvement. But the rule governing how they borrow is not symmetric, and that rule is the single most useful thing in this course.",
}

export const whoWins: Section = {
  id: 'who-wins',
  title: 'Who evicts whom',
  scene: 'mem-who-wins',
  focus: 'why',
  slide: `## Who evicts whom

\`spark.memory.storageFraction\` (0.5) is **not a reservation.** It's only the **floor storage is allowed to defend.**

| | |
|---|---|
| **Execution evicts storage** | down to that floor, whenever it needs to |
| **Storage never evicts execution** | it waits, or spills to disk instead |

### Why the asymmetry is right
One of these can be rebuilt for free; the other can't be rebuilt at all.

- **Evicted cache** → lineage recomputes it. You lose *time*.
- **Evicted execution state** → mid-shuffle, that work is simply *gone*.

So Spark protects the thing it can't rebuild — and **your cache is the thing it's willing to lose.**

### Which answers "why did my cache disappear?"
It didn't disappear. A large join legitimately took the memory back, exactly as designed, and nothing told you.

> Check **Fraction Cached** in the Storage tab. It's frequently well under 100%.`,
  narration:
    "Here's the rule, and it's the thing to take away from this course. There's a setting called storageFraction, defaulting to zero point five, and almost everyone misreads it. It is not a reservation. It does not mean half the pool belongs to storage. It means: this is the floor that storage is allowed to defend. Above that floor, storage is borrowing, and the loan can be called at any time. The borrowing is asymmetric. Execution can evict storage, down to that floor, whenever it needs the space. Storage can never evict execution — if execution is holding memory, storage waits, or spills to disk instead. Now, why is that the right design? Because the two things are not equally replaceable. If cached data is evicted, Spark knows exactly how to get it back: the lineage graph says how that partition was computed, so it recomputes it. You lose time. You do not lose correctness. But if execution state were evicted mid-operation — half a hash table, a partially accumulated aggregate — that work is simply gone, and there's no recipe to rebuild it from. So Spark protects the thing it cannot rebuild, and your cache is the thing it is willing to lose. Which gives the answer to the most common confused bug report in Spark: my cache disappeared. It didn't disappear. You cached a DataFrame, then ran a large join, and that join legitimately claimed the memory back. Everything worked exactly as designed, and nothing told you. Go and look at Fraction Cached in the Storage tab. It's very frequently well under a hundred percent, and people have no idea.",
}

export const oneParentThreeChildren: Section = {
  id: 'one-parent-three-children',
  title: 'The only situation where caching reliably pays',
  scene: 'mem-one-parent',
  focus: 'with',
  slide: `## When caching pays

An ordinary shape: read, clean, then answer three questions from the cleaned data.

\`\`\`python
clean = raw.filter(...).join(...)   # expensive
clean.count()                       # job 1
clean.write(summary)                # job 2
clean.write(detail)                 # job 3
\`\`\`

### Without cache: the parent runs **three times**
A DataFrame is a recipe, not a result. Each action re-cooks it from the source — three reads, three joins.

### With cache: once, then reused
\`\`\`python
clean.cache()
clean.count()   # fills it
\`\`\`

### The condition, stated precisely
Cache a parent that is **expensive**, **shared** by several downstream actions, and **reused**.

Miss any of the three and caching costs memory it never repays — memory that execution then has to evict, which makes things *worse*.

> If it's used once, caching is pure loss. That's the commonest misuse.`,
  narration:
    "So when should you cache? There's one shape where it reliably pays, and it's worth being precise, because caching is misused more than almost anything else in Spark. Here's the shape. You read some raw data, filter it, join it to something — that's expensive. Call the result clean. Then you do three things with clean: count it to check the size, write a summary, and write a detailed output. Three actions. Without caching, that's three jobs, and each one re-runs the entire chain from the source. Three reads of the raw data, three filters, three joins. Because a DataFrame is a recipe, not a result — assigning it to a variable stores instructions, and instructions get followed again every time you ask for something. With cache, the first action materialises the result and keeps it, and the other two read from memory. One read, one join, done. Now here's the condition, and all three parts have to hold. The parent must be expensive — if it's a cheap scan, recomputing is fine. It must be shared by several downstream actions. And it must actually be reused — used more than once. Miss any one of those and caching costs you memory it never repays. And this is worse than neutral, because that memory isn't free: it comes out of the same pool execution needs, so execution has to evict it, and now you've added work without saving any. The commonest misuse in Spark is caching something used exactly once, usually because someone read that caching makes things faster. On a single-use DataFrame it is pure loss.",
}

export const cacheVsPersist: Section = {
  id: 'cache-vs-persist',
  title: 'cache() vs persist(), and the default that differs',
  scene: 'mem-cache-vs-persist',
  focus: 'defaults',
  slide: `## cache() vs persist()

\`cache()\` is \`persist()\` with the default level. Nothing else.

### And the default differs by API — a genuine trap
| | |
|---|---|
| \`rdd.cache()\` | **MEMORY_ONLY** — drops partitions that don't fit |
| \`df.cache()\` | **MEMORY_AND_DISK** — spills them instead |

Same method name, two behaviours. The DataFrame default is the safer one, and it's why RDD caching bites harder.

### Both are lazy. \`unpersist()\` is not.
\`\`\`python
df.cache()        # marks it. Nothing happens.
df.count()        # NOW it fills
\`\`\`

And a *partial* action fills it **partially**:
\`\`\`python
df.cache(); df.take(1)   # caches ONE partition
\`\`\`
Silently. The Storage tab shows a tiny fraction cached and no warning anywhere.

> \`unpersist()\` is eager, and worth calling when you're done — that memory is execution's otherwise.`,
  narration:
    "Cache and persist get talked about as though they're different things. They're not: cache is exactly persist called with the default storage level. That's the whole difference. But there's a trap in the word default, because it isn't the same default for both APIs. Calling cache on an RDD gives you MEMORY_ONLY. Calling cache on a DataFrame gives you MEMORY_AND_DISK. Same method name, materially different behaviour. MEMORY_ONLY means: if a partition doesn't fit, drop it, and recompute it when needed. MEMORY_AND_DISK means: if it doesn't fit in memory, write it to local disk and read it back. The DataFrame default is much safer, and it's a large part of why RDD caching catches people out more. Second thing, and this one causes a lot of confused debugging. Both are lazy. Calling cache does not cache anything. It marks the DataFrame as something to cache the next time it's computed. Nothing happens until an action runs. So the idiom is: call cache, then call count, and the count is what actually fills it. And there's a sharper version of the same trap. If your action only touches part of the data, only that part gets cached. Call cache and then take one row, and Spark caches exactly one partition. You look at the Storage tab, see a tiny fraction cached, and wonder what went wrong. Nothing went wrong; you only asked for one row. Finally, unpersist. That one is eager — it takes effect immediately — and it's worth calling when you're finished with something, because until you do, that memory belongs to storage and execution has to fight for it.",
}

export const storageLevels: Section = {
  id: 'storage-levels',
  title: 'The storage levels',
  scene: 'mem-storage-levels',
  focus: 'table',
  slide: `## The storage levels

Three independent choices: **memory or disk**, **deserialized or serialized**, **replicated or not.**

| | |
|---|---|
| \`MEMORY_ONLY\` | objects in memory; drops whole partitions that don't fit |
| \`MEMORY_AND_DISK\` | memory first, the rest serialized to disk |
| \`MEMORY_ONLY_SER\` | serialized in memory — smaller, CPU to decode |
| \`DISK_ONLY\` | serialized on disk, always |
| \`..._2\` | any level, replicated to a second node |
| \`OFF_HEAP\` | outside the JVM heap, in Tungsten memory |

### The deserialized / serialized trade
**Deserialized** is fast to read and large — real JVM objects, with the object tax.
**Serialized** is compact and costs CPU on every single read.

If you're memory-bound and have CPU to spare, \`_SER\` is a real win. If you're CPU-bound it makes things worse.

> \`_2\` looks wasteful and occasionally isn't: if losing a partition means a 40-minute recompute, a second copy is cheap insurance.`,
  narration:
    "The storage levels look like a long list and they're really three independent yes-or-no choices, combined. Memory or disk. Deserialized or serialized. Replicated or not. MEMORY_ONLY keeps partitions as JVM objects in memory, and drops any that don't fit — those get recomputed when needed. MEMORY_AND_DISK keeps what fits in memory and writes the rest to local disk, serialized. That's the DataFrame default and it's the sensible starting point. MEMORY_ONLY_SER keeps everything in memory but serialized, which is much more compact — remember the object overhead problem, where a three-byte string costs forty-eight bytes as an object. Serialized form avoids that, at the cost of CPU to decode on every read. DISK_ONLY skips memory entirely, which makes sense when recomputation is more expensive than a disk read — an expensive join, say, where reading from local SSD beats redoing the join. The underscore-two variants replicate to a second node. And OFF_HEAP puts data outside the JVM heap in Tungsten-managed memory, where garbage collection never sees it. The key trade is deserialized versus serialized. Deserialized is fast to read and large. Serialized is compact and costs CPU on every read. So if you're memory-bound and have CPU headroom, the SER variants are a genuine win. If you're CPU-bound, they make things worse. That's a thing to measure rather than guess. And replication looks wasteful until you consider the case where losing a partition means a forty-minute recomputation. Then a second copy is cheap insurance.",
}

export const whatEvictionDoes: Section = {
  id: 'what-eviction-does',
  title: 'What eviction actually does',
  scene: 'mem-eviction',
  focus: 'worst',
  slide: `## What eviction does

**LRU**, and it works on **whole partitions.** A partition is never half-cached — the unit that arrives is the unit that leaves.

### What happens next depends entirely on the level
| | |
|---|---|
| \`MEMORY_ONLY\` | **recomputed** — the lineage runs again, silently |
| \`MEMORY_AND_DISK\` | **read back from disk** — slower than memory, far faster than redoing it |

That's the whole practical difference between the two defaults.

### The failure mode worth naming
A cache **too big to fit** thrashes: evict, recompute, evict, recompute. Every action pays for the last one's eviction.

The symptom is a job that got *slower* after someone added caching — which reads as impossible, and isn't.

> If \`Fraction Cached\` is well under 100% and the job is slow, un-caching is often the fix.`,
  narration:
    "When memory runs short and execution needs space, storage gives some back. The policy is least-recently-used, and it operates on whole partitions. A partition is never half-cached — the unit that arrived is the unit that leaves. That's worth knowing because it means caching is granular at the partition level, not the row level, and a dataset with four partitions has only four things that can be evicted. What happens after eviction depends entirely on your storage level, and this is the whole practical difference between the two defaults. With MEMORY_ONLY, the partition is gone, so the next time anything needs it, Spark recomputes it from lineage. Silently. No warning, no log line you'd notice — just a slower job. With MEMORY_AND_DISK, the partition was written to local disk on the way out, so it gets read back. Slower than memory, dramatically faster than recomputing an expensive join. Now the failure mode I'd most like you to recognise, because it's counterintuitive. If you cache something too large to fit, you get thrashing. Partition one is evicted to make room for partition two. Then something needs partition one, so it's recomputed, which evicts partition two. Then something needs partition two. Every single action is paying for the previous action's eviction, and you've added all the overhead of caching with none of the benefit. The symptom is a job that got slower after someone added caching to make it faster — which sounds impossible and isn't. If Fraction Cached is well under a hundred percent and the job is slow, removing the cache is very often the fix.",
}

export const checkpoint: Section = {
  id: 'checkpoint',
  title: 'checkpoint(): cutting lineage, not caching it',
  scene: 'mem-checkpoint',
  focus: 'check',
  slide: `## \`checkpoint()\`

A different tool for a different problem.

### \`cache()\` keeps the result **and** the lineage
It has to. If the cache is evicted, the lineage is the only way to get the data back.

So the graph is still there — still hundreds of steps long, still carried by the driver, still replayed on failure.

### \`checkpoint()\` writes to reliable storage and **cuts** it
\`\`\`python
sc.setCheckpointDir("s3://.../ckpt")
df.checkpoint()
\`\`\`
Data goes to durable storage, and the new lineage is **one step**: read this file. Everything before it is discarded.

### When you actually need it
| | |
|---|---|
| **Iterative algorithms** | 200 iterations = a 200-deep graph |
| **Streaming state** | where it isn't optional |

> \`localCheckpoint()\` is faster and not durable — it truncates the lineage but stores to executor disk, so losing an executor loses it *with no way back*.`,
  narration:
    "Checkpoint gets confused with cache constantly, and they solve different problems. Cache keeps the result and the lineage. It has to keep the lineage — because if the cache gets evicted, which we've established happens routinely, the lineage graph is the only way to get the data back. So after caching, the graph is still there. Still hundreds of steps long if your job built hundreds of steps. Still carried around by the driver, still replayed on failure. Checkpoint writes the data to reliable storage — HDFS or S3, somewhere durable — and then cuts the lineage. The new lineage is one step: read this file. Everything before it is discarded, because it's no longer needed; the data is safely somewhere that doesn't depend on being able to recompute it. So when do you need that? Two situations. Iterative algorithms, primarily. If you're running a machine learning loop or a graph algorithm for two hundred iterations, each iteration adds to the lineage graph, and after two hundred you have a graph that's expensive for the driver to hold and catastrophic to replay if anything fails. Checkpointing periodically resets it. The second is streaming state, where checkpointing isn't optional — it's how the engine achieves fault tolerance across restarts. One footnote worth knowing: there's also localCheckpoint, which truncates lineage but writes to executor local storage rather than durable storage. It's faster. But it means if you lose that executor, you've lost the data and the lineage that could have rebuilt it, so the job fails outright. Use it deliberately, not by default.",
}

export const spill: Section = {
  id: 'spill',
  title: 'Spilling, and the two numbers that measure it',
  scene: 'mem-spill',
  focus: 'metrics',
  slide: `## Spilling

**Execution** memory running out — not storage. A sort or aggregate is accumulating state and the pool won't stretch, so it writes a sorted run to disk and carries on.

Then reads it back to merge. **You pay for it twice.**

### The two numbers in the UI measure different things
| | |
|---|---|
| **Spill (Memory)** | the size it had *in memory*, deserialized |
| **Spill (Disk)** | the size *written*, serialized and compressed |

A large memory figure against a small disk figure is **normal** — it's the same data, measured twice, on either side of serialization. Don't read it as a ratio.

### And the fix is almost never more memory
Spilling means a **partition was too big.** So:
- **More partitions** — each one smaller
- **Or fix the skew** — if only *one* task is spilling, it's not a memory problem, it's a distribution problem

> Non-zero spill isn't automatically a crisis. Every task spilling a little is fine. One task spilling enormously is not.`,
  narration:
    "Spilling is execution memory running out, and it's worth being clear that it's execution, not storage. A sort is accumulating rows, or an aggregation is building up state, or a hash join is constructing its build side — and the pool won't stretch any further. So the operator writes a sorted run out to disk, empties its buffer, and carries on. Later it reads those runs back to merge them. Which means you pay for that data twice: once writing, once reading. Now the two numbers in the Spark UI, because they confuse people. Spill parenthesis memory is the size the data occupied in memory, as deserialized objects. Spill parenthesis disk is the size actually written out, serialized and compressed. Those measure the same data on either side of serialization, so it is completely normal to see a very large memory figure next to a much smaller disk figure — a ten-to-one ratio isn't unusual, because deserialized JVM objects are bloated and compressed bytes are not. Don't read that as a ratio meaning anything. Here's the part that matters for what you do about it. The fix for spilling is almost never more memory. Spilling means a partition was too big for the memory a task had. So the answer is to make partitions smaller — increase the partition count, so each task handles less. Or, if only one task is spilling while the others are fine, then it isn't a memory problem at all. It's a distribution problem — skew — and no amount of memory will fix it, because the memory is fine everywhere except on the one task holding forty percent of the data.",
}

export const offHeap: Section = {
  id: 'off-heap',
  title: 'Off-heap, and why it is not a free win',
  scene: 'mem-off-heap',
  focus: 'cost',
  slide: `## Off-heap

\`\`\`
spark.memory.offHeap.enabled = true
spark.memory.offHeap.size = 8g
\`\`\`

Spark allocates directly through \`Unsafe\`, outside the JVM heap. **The GC never traces it**, so it adds nothing to pause time however large it gets.

Note: that size is a **second budget**, not a share of the first.

### And what it costs you
| | |
|---|---|
| **Two pools to size** | plenty of one, none of the other — a new way to fail |
| **It counts in the container** | raise \`memoryOverhead\` too, or be **OOMKilled** |
| **Leaks are yours** | you opted out of the collector |

### So: only when GC is the *measured* problem
Look at **GC Time** as a fraction of task time in the Executors tab. If it's a few percent, off-heap changes nothing worth having. If it's a third, it's worth trying — and worth measuring before and after.

> A tuning option, not a default. It gets recommended far more casually than it deserves.`,
  narration:
    "Off-heap memory gets recommended more casually than it deserves, so let's be precise about what it buys and what it costs. When you enable it, Spark allocates memory directly through the Unsafe API, outside the JVM heap, and manages it explicitly — allocate, use, free. The garbage collector never traces that memory, so it contributes nothing to pause times no matter how large it grows. For a job where GC pauses genuinely dominate, that's a real and substantial win. One detail people get wrong: the off-heap size you configure is a second budget, not a share of the first. You're not moving memory out of the heap; you're adding a new pool alongside it. Which means your total footprint goes up, and that leads directly to the costs. Three of them. First, you now have two numbers to size instead of one, and you can fail in a new way — plenty of heap and no off-heap, or the reverse. Second, and this one catches people on Kubernetes: off-heap memory counts toward the container's limit. If you enable it without raising memoryOverhead, the kernel OOM-kills your executor and you get exit one-three-seven with no Java error at all. Third, memory management errors become yours. So the rule is: only turn this on when GC is the measured problem, not the suspected one. Go to the Executors tab and look at GC Time as a fraction of total task time. If it's a few percent, off-heap will change nothing you care about. If it's a third, it's worth trying — and worth measuring carefully before and after, because the interaction with container limits means it can easily make things worse.",
}

export const readingTheStorageTab: Section = {
  id: 'reading-the-storage-tab',
  title: 'Reading the Storage tab',
  scene: 'mem-storage-tab',
  focus: 'table',
  slide: `## Reading the Storage tab

Four numbers that between them answer *"is my caching doing anything at all?"*

| Read | Healthy | Otherwise |
|---|---|---|
| **Fraction Cached** | 100% | partitions evicted, or never filled |
| **Size in Memory** | what you expected | far larger — deserialized objects are big |
| **Size on Disk** | zero | it didn't fit; \`MEMORY_AND_DISK\` caught it |
| **GC Time** *(Executors)* | a few % | a third — the heap is too full, cache included |

**Nothing listed at all** → you called \`cache()\` but never ran an action. It's lazy.

### The rule the whole course argues for
**Cache a parent that is expensive, shared and reused — and measure.**

Otherwise don't. Caching is not free, it competes with execution for the same pool, and used wrongly it makes jobs slower rather than faster.

> \`Size in Memory\` being 5× the source file isn't a bug. It's the object tax, and it's why \`_SER\` exists.`,
  narration:
    "Let's finish with where to look, because all of this is visible and almost nobody checks it. Open the Spark UI, go to the Storage tab, and there are four numbers worth reading. Fraction Cached is the first and most important. It should be a hundred percent. If it's sixty percent, then forty percent of what you asked to cache isn't cached, and every action touching that data is recomputing or reading from disk without telling you. That single number resolves most confusion about caching. Size in Memory is next. Compare it to what you expected. If your source file is two gigabytes and Size in Memory says ten, that's not a bug — that's the object overhead we talked about, deserialized JVM objects being much larger than compressed columnar bytes on disk. It's also exactly why the serialized storage levels exist. Size on Disk should ideally be zero. If it's not, your cache didn't fit in memory and MEMORY_AND_DISK caught the overflow — which is the system working, but it's telling you something. And then over on the Executors tab, GC Time as a fraction of task time. A few percent is normal. A third means the heap is too full, and your cache is part of why. One more: if nothing is listed at all on the Storage tab, you called cache and never ran an action. It's lazy. And the rule the whole course argues for: cache a parent that is expensive, shared and reused, and then measure whether it helped. Otherwise don't. Caching is not free — it competes with execution for the same pool — and used carelessly it makes jobs slower rather than faster.",
}
