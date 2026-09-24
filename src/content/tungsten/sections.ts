import type { Section } from '../types'

export const theObjectTax: Section = {
  id: 'the-object-tax',
  title: 'The JVM object tax',
  scene: 'tun-object-tax',
  focus: 'gc',
  slide: `## The JVM object tax

\`"abc"\` is three bytes of information. As a Java \`String\` it costs roughly **48**.

| | |
|---|---|
| Object header | ~16 bytes |
| Pointer to the char array | 8 bytes |
| The array, with *its* header | ~16 + padding |
| **Your actual data** | **3 bytes** |

### Multiply by a billion rows
16× overhead, and every value is a **separate object on the heap**.

### The second cost is worse
The garbage collector has to trace live objects. Its work scales with **how many** there are, not how big they are.

A billion tiny objects is close to the worst input a generational GC can be handed — and in bad cases a third of your runtime is pause, not progress.

> Storing data *as objects* is the problem. Tungsten's answer is to stop.`,
  narration:
    "To understand why DataFrames beat hand-written RDD code, start with a cost that's invisible until you measure it. Take the string a-b-c. That's three bytes of information. Stored as a Java String object, it costs roughly forty-eight. Where does that go? About sixteen bytes of object header, which every JVM object carries — a class pointer and a mark word. Eight bytes for a reference to the underlying character array. Then the array itself, which has its own sixteen-byte header, plus padding to align to eight bytes. And somewhere in there, three bytes of actual data. So about a sixteen-fold overhead. Now multiply by a billion rows, and by however many columns each row has. You're spending most of your memory on bookkeeping. But here's the part that actually kills jobs, and it's not the size. It's the garbage collector. The JVM's collector works by tracing live objects — walking references to find out what's still reachable. Its cost scales with the number of objects, not the total bytes. A billion tiny objects is very close to the worst possible input for a generational collector. And when GC becomes the bottleneck, you don't get a gradual slowdown, you get pauses: moments where all your application threads stop entirely while the collector works. In bad cases a third of your runtime is pause rather than progress, and you can see it directly in the GC Time column of the Spark UI. So the diagnosis is: storing your data as JVM objects is the problem. Tungsten's answer is simply to stop doing that.",
}

export const theBinaryRow: Section = {
  id: 'the-binary-row',
  title: 'UnsafeRow: one row, one block of bytes',
  scene: 'tun-binary-row',
  focus: 'row',
  slide: `## UnsafeRow

One row, one **contiguous block of bytes**. No object headers, no pointers between fields, nothing inside for the GC to trace.

| Region | Holds |
|---|---|
| **Null bit set** | one bit per field |
| **Fixed-width region** | 8 bytes per field, always |
| **Variable-length tail** | strings and arrays |

### How a variable-length field fits in a fixed 8 bytes
It doesn't store the string. It stores an **offset and a length**, packed into the slot — a pointer into the row's own tail.

So every field is at a **known position**, whatever its type.

### What the layout buys
- **A fraction of the size** — no headers, no padding, no pointers
- **Invisible to the GC** — one object per row, not one per field
- **Field \`n\` without decoding** — read at a computed byte offset

> That last one matters more than it sounds: Spark can compare two rows' join keys without ever turning either into an object.`,
  narration:
    "Tungsten's answer is a format called UnsafeRow, and it's worth understanding because a lot follows from it. A row is stored as one contiguous block of bytes. Not a collection of objects with references between them — one block. The layout has three regions. First a null bit set: one bit per field, saying whether it's null. Then a fixed-width region, with exactly eight bytes per field regardless of type. Then a variable-length tail where strings and arrays actually live. Now, the obvious question: how does a variable-length string fit in a fixed eight-byte slot? It doesn't. The slot doesn't hold the string — it holds an offset and a length, packed together, pointing into the row's own tail. So the slot is fixed-width and the data isn't. Which means every field lives at a position you can compute arithmetically, whatever its type. Three things follow. The size collapses — no headers, no padding, no pointer per field. The garbage collector sees one object per row rather than one per field, so its tracing work drops by a factor of the column count. And you can read field number five by computing an offset and reading bytes, without decoding anything else in the row. That third point does more work than it appears to. When Spark compares two rows' join keys, or sorts by a column, or hashes a key, it operates directly on bytes. It never constructs a Java object for either row. Whole operations happen without materialising anything the GC would care about. That's the shift: your data stops being objects and becomes memory that Spark manages deliberately.",
}

export const offHeap: Section = {
  id: 'off-heap',
  title: 'Off-heap: memory Spark manages itself',
  scene: 'tun-off-heap',
  focus: 'honest',
  slide: `## Off-heap

### On-heap Tungsten
Rows live in \`byte[]\` arrays the JVM owns. Far fewer objects than before — but the arrays are still objects, so the GC still considers them.

### Off-heap
Memory allocated **outside the JVM heap**, through \`Unsafe\`. Spark allocates and frees it explicitly, like C.

\`\`\`
spark.memory.offHeap.enabled = true
spark.memory.offHeap.size = 8g
\`\`\`

The garbage collector **never sees it at all.**

### And it is not a free win
- You now size **two** pools by hand — heap *and* off-heap — and getting it wrong means an OOM from a new direction
- A leak is **yours**, not the JVM's
- On Kubernetes it counts toward the container limit, so \`memoryOverhead\` has to grow too

> Real, and worth measuring before enabling. It's a tuning option, not a default.`,
  narration:
    "There's a further step available, and it's worth knowing what it does and doesn't buy. Even with Tungsten's binary format, rows normally live inside byte arrays that the JVM owns. That's already an enormous improvement — a million rows might be a handful of large arrays instead of a hundred million small objects — but those arrays are still objects, and the collector still has to consider them. Off-heap goes further. Spark allocates memory outside the JVM heap entirely, using the Unsafe API, and manages it explicitly: allocate, use, free, much like C. The garbage collector never sees that memory at all, so it contributes nothing to pause times no matter how large it gets. You enable it with two settings: off-heap enabled, and an explicit off-heap size. Now let me be honest about the trade, because this gets recommended more casually than it should be. First, you're now sizing two pools by hand rather than one. Get the split wrong and you get out-of-memory errors from a new direction — plenty of heap, no off-heap, or the reverse. Second, memory management errors become yours. The JVM's collector is imperfect but it's also very good, and you've just opted out of it. Third, on Kubernetes, off-heap memory counts toward the container's memory limit, so if you enable it without increasing memoryOverhead, the kernel OOM-kills your executor and Spark never sees a Java error at all. It's a real tuning option with real gains for GC-bound workloads. It is not a default, and it's worth measuring before and after rather than assuming.",
}

export const encoders: Section = {
  id: 'encoders',
  title: 'Encoders: the bridge, and its toll',
  scene: 'tun-encoders',
  focus: 'cost',
  slide: `## Encoders

The translator between a **JVM object** and an **UnsafeRow** — in both directions, as generated code.

\`\`\`
case class Flight(dest: String, cnt: Long)
   ↕  Encoder[Flight]
UnsafeRow  ← what the engine operates on
\`\`\`

For a Scala case class, the encoder is generated at **compile time** from the type. That's why \`Dataset[T]\` needs an implicit \`Encoder[T]\` in scope.

### Which is the real cost of a typed Dataset
| | |
|---|---|
| **DataFrame ops** | never leave the binary form |
| **A typed \`.map { … }\`** | decode → your code → re-encode, **per row** |

A \`Dataset\` gives you compile-time type safety and IDE completion. It costs you a round trip through objects on every typed lambda.

> \`DataFrame\` is \`Dataset[Row]\` — and \`Row\` is the one type whose "encoder" is a no-op, because it's already the binary form.`,
  narration:
    "If the engine works on binary rows, but your Scala code works on objects, something has to translate. That's an encoder. An encoder is generated code that converts a JVM object into an UnsafeRow and back again. For a Scala case class, it's generated at compile time from the type definition, which is why a typed Dataset requires an implicit Encoder in scope — that's the compiler telling you it needs to build the translation before it can proceed. Now here's the part with a real performance consequence, and it explains something that confuses people about Datasets versus DataFrames. When you write pure DataFrame operations — select, filter, groupBy on columns — your data never leaves the binary form. Spark reads bytes, compares bytes, writes bytes. No object is ever constructed. But the moment you write a typed lambda on a Dataset — a map with a function that takes a Flight and returns something — Spark has to decode the binary row into an actual Flight object, hand it to your function, take the result, and re-encode it back into binary. Per row. So a Dataset gives you genuinely valuable things: compile-time type safety, so a misspelled field is a compile error rather than a runtime one, and IDE completion. It costs you a round trip through objects on every typed operation. That's the trade, and it's worth making deliberately rather than by habit. One footnote that ties this together: a DataFrame is just a Dataset of Row. And Row is special, because its encoder is essentially a no-op — a Row already is the binary form. That's why DataFrames are the fast path.",
}

export const cacheLocality: Section = {
  id: 'cache-locality',
  title: 'The layout is the speedup, not the code',
  scene: 'tun-cache-locality',
  focus: 'contig',
  slide: `## The layout is the speedup

A CPU hasn't been limited by arithmetic for twenty years. It's limited by **waiting for memory.**

| | |
|---|---|
| **L1 cache** | ~1 ns |
| **L3 cache** | ~20 ns |
| **Main memory** | **~100 ns** — a hundred wasted cycles |

### Pointer-chasing loses that race
Every hop is a fresh address the prefetcher couldn't predict. Objects scattered across the heap mean a cache miss **per field**.

### Contiguous bytes win it
The hardware prefetcher recognises a sequential scan and fetches the next cache line **before it's asked for**. By the time you want row 2, it's already in L1.

Tungsten also does **cache-aware sorting**: sort keys and pointers are kept together, so comparisons stay in cache instead of dereferencing into the heap.

> None of this is a faster algorithm. It's the same work, arranged so the CPU doesn't wait.`,
  narration:
    "Here's the part that makes Tungsten more than a memory saving. Modern CPUs have not been limited by arithmetic for about twenty years. They're limited by waiting for memory. The numbers are worth internalising. Reading from L1 cache takes roughly one nanosecond. L3, about twenty. Main memory, around a hundred. So a cache miss costs you something like a hundred cycles during which the processor is doing nothing at all — it's stalled, waiting for bytes to arrive. Now think about what pointer-chasing does to that. Your row is an object. It has a reference to a String, which is somewhere else on the heap. That String has a reference to a char array, somewhere else again. Reading one field means following a chain of addresses, and each hop is an address the hardware prefetcher had no way to predict. So you get a cache miss per field, and your CPU spends its life waiting. Now the contiguous layout. Rows are laid out one after another in memory. The prefetcher is very good at recognising a sequential scan — it notices you're walking forward and starts fetching the next cache line before you ask for it. By the time you want row two, it's already sitting in L1. The stall disappears. Tungsten leans into this further with cache-aware sorting: when sorting, it keeps the sort keys and the pointers together in one array, so comparisons read from cache rather than dereferencing back into the heap for every comparison. The thing to take away is that none of this is a cleverer algorithm. It's exactly the same work, arranged so the processor isn't waiting.",
}

export const virtualCallProblem: Section = {
  id: 'the-virtual-call-problem',
  title: 'The other half: how the plan is executed',
  scene: 'tun-virtual-calls',
  focus: 'cost',
  slide: `## The other half of the problem

Memory layout was half. The other half is **how the operator tree is executed.**

### The classic model
Every operator is an iterator. Each calls \`next()\` on its child.

\`\`\`
Project.next() → Filter.next() → Scan.next()
\`\`\`

This is the textbook design — correct, general, and easy to reason about. It's also how most databases worked for decades.

### What it costs, per row, per operator
| | |
|---|---|
| **A virtual call** | not inlinable, hard to branch-predict |
| **An intermediate row** | materialised between every pair |
| **Overhead > work** | the call costs more than the comparison inside it |

For a filter that does one string comparison, you're paying a method dispatch and an object allocation to perform a single \`equals\`.

> Correct, general, and entirely dominated by its own bookkeeping.`,
  narration:
    "Memory layout was half the story. The other half is how the plan actually gets executed, and it's a separate problem with a separate fix. The classic design — the one in every database textbook, and how most engines worked for decades — is that every operator is an iterator. Project has a next method, which calls next on Filter, which calls next on Scan, which returns a row. Pull one row through the whole chain, then pull the next. It's called the Volcano model, and it has real virtues: it's correct, it's completely general, any operator composes with any other, and it's easy to reason about. But count what it costs. Per row, per operator, you pay a virtual method call. Virtual means the JVM can't always tell at compile time which implementation will be invoked, so it can't reliably inline it, and the branch predictor has a harder time. You also materialise an intermediate row object between every pair of operators. Now compare that against the work being done. For a filter, the actual work is one string comparison. And around that single comparison you've wrapped a virtual dispatch and an object allocation. The overhead isn't a percentage on top of the work — it dominates the work, often by an order of magnitude. So you have an execution model that is correct and general and almost entirely occupied with its own bookkeeping. That's the second thing Tungsten set out to fix, and the fix is quite radical.",
}

export const wholeStageCodegen: Section = {
  id: 'whole-stage-codegen',
  title: 'Whole-stage code generation',
  scene: 'tun-codegen',
  focus: 'result',
  slide: `## Whole-stage code generation

Stop interpreting the tree. **Compile it.**

Spark generates Java source for a whole run of operators, compiles it at runtime, and runs that instead.

\`\`\`java
while (scan.hasNext()) {
  row = scan.next();
  if (row.country != "IN") continue;   // Filter
  emit(row.dest, row.cnt);             // Project
}
\`\`\`

One loop. The operators no longer exist as objects — their logic is **inlined into it**.

### Why this beats the sum of its parts
| | |
|---|---|
| **No virtual calls** | nothing left to dispatch |
| **No intermediate rows** | values stay in CPU registers |
| **The JIT can optimize it** | unroll, vectorise, inline |

That last one is the real prize: a tight hand-written-looking loop is exactly what the JVM's JIT compiler is best at. Spark generates the kind of code the JIT loves.

> Spark 2.0 · \`spark.sql.codegen.wholeStage\`, on by default.`,
  narration:
    "The fix is to stop interpreting the operator tree and compile it instead. This is whole-stage code generation, it arrived in Spark 2.0, and it's one of the larger performance jumps in the project's history. Here's what happens. Instead of executing the tree by having operators call each other, Spark generates Java source code for a whole run of operators — a whole stage — and compiles that at runtime. What comes out is a single loop. While the scan has rows: get a row, if the country isn't India then skip it, otherwise emit the destination and the count. The Filter and the Project no longer exist as objects. Their logic has been inlined directly into the loop body. Three things follow, and the third is the biggest. No virtual calls, because there's nothing left to dispatch to — it's all one method. No intermediate rows, because values can live in CPU registers between operations rather than being written into objects. And the JIT compiler can now optimize it properly. That third point is the real prize. The JVM's just-in-time compiler is extremely good at optimising tight loops — it unrolls them, it can vectorise them, it inlines aggressively. What it can't do much with is a chain of polymorphic virtual calls through an object graph. So by generating code that looks like something a human would have written by hand, Spark hands the JIT exactly the shape it's best at. The result is that a generated stage can run close to the speed of purpose-written Java, on a query you expressed as a DataFrame.",
}

export const seeingIt: Section = {
  id: 'seeing-it',
  title: 'Seeing codegen in your own plan',
  scene: 'tun-seeing-it',
  focus: 'code',
  slide: `## Seeing it

\`\`\`
*(1) Project [dest#7]
+- *(1) Filter (country#9 = IN)
   +- FileScan parquet [dest#7,country#9]
\`\`\`

### The \`*\` is the whole signal
\`*(1)\` means **whole-stage codegen stage 1**. Project and Filter carry the *same* number, so they were fused into one generated method.

**No \`*\` means that operator is running the old iterator-at-a-time way.** Worth noticing when a query is slower than it should be.

### Reading the generated source
\`\`\`
df.explain("codegen")
\`\`\`
Prints the actual Java. It's long and mechanical, but skimming one loop once makes everything above concrete — you can see your filter as an \`if\` and your projection as an \`append\`.

> A plan where the expensive operators have no \`*\` is a plan worth a second look.`,
  narration:
    "All of this is visible in your own plans, and it takes about five seconds to check. Run explain on a filtered, projected DataFrame and look at the physical plan. You'll see operators prefixed with an asterisk and a number in brackets. That asterisk is the signal. Asterisk bracket one means this operator is part of whole-stage codegen stage one. And if Project and Filter both carry bracket one, they were fused into the same generated method — one loop doing both. The more useful observation is the negative one. An operator with no asterisk is not part of a codegen stage. It's running the old iterator-at-a-time way, with all the per-row overhead we just discussed. So when a query is slower than you expect, scanning the plan for operators that are missing their asterisk is a genuinely good first move. If your expensive operator isn't generating code, that's worth understanding before you tune anything else. You can go further and read the generated code itself, with explain and the string codegen. What you get is the actual Java that Spark compiled. It's long, it's mechanical, and it's full of generated variable names — but it's worth skimming once, because it makes everything abstract about this course concrete. You can find the while loop. You can find your filter, sitting there as an if statement with a continue. You can find your projection as an append call. Seeing your own query as a loop, once, is the thing that makes the rest of this stick.",
}

export const whereItStops: Section = {
  id: 'where-it-stops',
  title: 'Where codegen stops',
  scene: 'tun-where-it-stops',
  focus: 'lesson',
  slide: `## Where it stops

Codegen works by **inlining an operator's logic into a loop.** So logic it can't read, it can't inline.

### What breaks the fusion
| | |
|---|---|
| **A Python UDF** | a different process entirely |
| **A Scala UDF** | a black box, even inside the JVM |
| **Very wide rows** | the generated method exceeds the JVM's 64 KB limit |

Each becomes a wall the generated loop stops at, and the stage splits around it.

### Which reframes what a UDF costs
The cost isn't only *running your function*. It's **everything around it that can no longer be fused.**

Drop one UDF into the middle of a clean chain and you don't pay for one operator — you pay for breaking the loop that contained six.

- **Prefer a built-in.** It fuses. Yours doesn't.
- **Or a SQL expression** — still a tree Spark can read and inline.

> That last row is real: wide, generated-column DataFrames can silently fall out of codegen entirely.`,
  narration:
    "Codegen isn't universal, and knowing where it stops changes how you write. The mechanism is inlining: Spark takes an operator's logic and writes it into the body of a generated loop. Which means logic Spark cannot read, it cannot inline. Three things break the fusion. A Python user-defined function, most obviously — that's not even in the JVM, it's a separate process, and rows have to be serialised out to it and back. A Scala or Java UDF is better, since it stays in the JVM, but it's still a black box: Spark has a function reference it can call, not an expression tree it can read and rewrite into a loop body. And a third one that catches people by surprise: very wide rows. The generated method has to fit inside the JVM's sixty-four kilobyte method size limit, and a DataFrame with hundreds of generated columns can produce a method too large to compile, at which point Spark silently falls back to the interpreted path. Now here's the reframing I'd like you to take away. The cost of a UDF is not just the cost of running your function. It's the cost of everything around it that can no longer be fused. Drop one UDF into the middle of a clean chain of six operators, and you don't pay for one operator — you pay for breaking the loop that contained all six, and the rows now have to be materialised on both sides of it. So the advice is stronger than it looks. Prefer a built-in function, because it fuses and yours doesn't. If there's no built-in, a SQL expression is still a tree Spark can read. A UDF is the last resort, not the convenient default.",
}

export const memoryEras: Section = {
  id: 'the-memory-eras',
  title: 'Three memory eras, and why your cache vanished',
  scene: 'tun-memory-eras',
  focus: 'unified',
  slide: `## Three memory eras

### Spark 1.x — two fixed pools, a wall between them
\`storage: 60%\` · \`shuffle: 20%\`, set in advance.

An idle storage pool could not help a starving shuffle. You tuned two numbers by hand and got it wrong.

### Spark 1.6+ — one pool, a soft boundary
\`spark.memory.fraction\` (0.6) is the shared pool. \`storageFraction\` (0.5) is **only the floor storage can defend** — not a reservation.

| | |
|---|---|
| **Execution can evict storage** | down to that floor |
| **Storage cannot evict execution** | spilling mid-shuffle loses work |

That asymmetry is deliberate: evicted cache can be **recomputed** from lineage. Evicted shuffle state is just lost.

### Which is why "my cache disappeared" isn't a bug
A big join legitimately took the memory back. Check **Fraction Cached** in the Storage tab — it's often well under 100%, and nobody told you.`,
  narration:
    "Let's close with memory management, because it explains a behaviour that looks like a bug and isn't. In Spark one-point-x, executor memory was divided into two fixed pools. A storage fraction for cached data, defaulting to sixty percent, and a shuffle fraction for joins and sorts, defaulting to twenty. Fixed, in advance, by configuration. The problem is obvious in hindsight: if your job caches nothing, sixty percent of your memory sits idle while your shuffle spills to disk for want of it. You tuned two numbers by hand, for every job, and you usually got it wrong. Spark one-point-six introduced the unified memory manager, and it's what you're running today. There's now one shared pool — spark dot memory dot fraction, sixty percent by default — and the boundary inside it is soft. Execution and storage borrow from each other as needed. There's a second setting, storageFraction, and the crucial thing is that it is not a reservation. It's only the floor that storage is allowed to defend. And the borrowing is deliberately asymmetric. Execution can evict cached data, down to that floor. Storage cannot evict execution. The reason is elegant: if cached data is evicted, lineage can recompute it — you lose time, not correctness. If shuffle state were evicted mid-operation, that work is simply gone. So Spark protects the thing that can't be rebuilt. And that asymmetry is exactly why people report that their cache mysteriously disappeared. It didn't disappear — a large join legitimately took the memory back, as designed. The place to check is the Fraction Cached column in the Storage tab, which is frequently well under a hundred percent, and nothing warns you.",
}
