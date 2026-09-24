import type { Section } from '../types'

export const twoProcesses: Section = {
  id: 'two-processes',
  title: 'Two processes, not one program',
  scene: 'pyb-two-processes',
  focus: 'cluster',
  slide: `## Two processes, not one program

On every worker node there are **two operating-system processes**:

| | |
|---|---|
| **The JVM** | the engine. Your data lives here. |
| **A Python process** | idle, until you need it |

They aren't one program with two languages in it. They're separate processes that talk **over a socket.**

### Which makes every question in this course the same question
> **Does a row have to leave the JVM?**

If no, PySpark runs at Scala speed. If yes, you pay — and the whole course is about how much, and how to pay less.

That's the entire framing. Everything that follows is a consequence of it.`,
  narration:
    "Here's the thing to understand before anything else, because every PySpark performance question reduces to it. When you run PySpark on a cluster, each worker node is running two separate operating-system processes. There's a JVM — that's the actual Spark engine, and it's where your data lives, as those compact binary rows. And there's a Python process, sitting there, usually idle. These are not one program that happens to speak two languages. They're two processes, with separate memory, separate garbage collection, separate everything, communicating over a socket. That's a real boundary with a real cost, in the same way that calling a web service is more expensive than calling a function. So every question in this course is the same question, asked about different code: does a row have to leave the JVM? If the answer is no, your PySpark runs at exactly the same speed as Scala, because the Python process never wakes up and your rows never move. If the answer is yes, you pay — and the rest of this course is about how much you pay, why, and what to do about it. That's the whole framing, and I'd encourage you to hold it while we go through the details, because it makes a set of otherwise-arbitrary performance advice fall into place. The reason people find PySpark performance confusing is that it has two completely different modes with a roughly tenfold gap between them, and nothing in the API tells you which one you're in.",
}

export const py4j: Section = {
  id: 'py4j',
  title: 'Py4J: how the driver talks to the JVM',
  scene: 'pyb-py4j',
  focus: 'scale',
  slide: `## Py4J

The driver is **also** two processes: your Python script, and a JVM beside it holding the real plan.

\`\`\`
your script  ←  Py4J socket  →  driver JVM
\`\`\`

Py4J lets Python hold **handles to Java objects** and call methods on them. When you write \`df.filter(...)\`, the Python \`DataFrame\` is a thin wrapper holding a reference to a Java object, and \`filter\` sends a message asking that object to make a new one.

### Why this costs nothing
**One message per API call you write — not per row.**

A hundred-line PySpark script is a few hundred messages. Even if each took a millisecond, that's under a second, once, for the whole job.

| | |
|---|---|
| Messages | ≈ the lines you wrote |
| Scope | **driver-side only** — Py4J never touches an executor |

> This is the boundary crossing that doesn't matter. The one that does is on the executors.`,
  narration:
    "Let's start with the boundary that doesn't cost you anything, because knowing why it's free makes the expensive one clearer. The driver is also two processes. Your Python script runs in a Python interpreter. Next to it, in the same machine, is a JVM that holds the actual Spark plan. They're connected by something called Py4J, which is a library that lets Python hold handles to Java objects and call methods on them over a socket. So when you write df dot filter, what's actually happening is this. Your Python DataFrame object is a thin wrapper — it holds a reference to a Java object living in that driver JVM. Calling filter sends a small message across the socket saying: take that object, apply this filter, give me back a handle to the result. The Python object you get is another thin wrapper around another Java object. Now, why is this free? Because there's one message per API call you write, not per row of data. You might write a hundred lines of PySpark. That's a few hundred messages, total, for the entire job. Even if each one took a full millisecond, you'd have spent under a second, once, at planning time. Meanwhile your data — billions of rows — never comes anywhere near this. It sits in the executors, in the JVM, untouched by any of this conversation. So Py4J is a driver-side mechanism, it never touches an executor, and it is not the reason anything is slow. Hold that distinction, because the boundary that costs you is a different one, on the executors, and it works completely differently.",
}

export const dataframeIllusion: Section = {
  id: 'the-dataframe-illusion',
  title: 'Pure DataFrame code never leaves the JVM',
  scene: 'pyb-illusion',
  focus: 'zero',
  slide: `## Pure DataFrame code never leaves the JVM

\`\`\`python
df.filter(col("country") == "IN") \\
  .groupBy("dest").count()
\`\`\`

Looks like Python operating on data. It isn't.

Those Python objects were **builders**. They described a plan, sent it over Py4J, and then had nothing more to do.

| | |
|---|---|
| The plan | built in the JVM |
| Optimized by | Catalyst — the same rules as Scala |
| Executed as | generated Java, on the executors |

### Python processes involved in the data: **zero**

Which is why pure DataFrame PySpark is **not slower than Scala.** Not "nearly as fast" — the same, because it's the same generated code running on the same bytes.

> This is the mode you want to stay in. The rest of this course is about what happens when you leave it.`,
  narration:
    "Now the claim that surprises people, and it's worth stating strongly because the received wisdom is wrong. Take a normal piece of PySpark: filter on a column, group by another, count. It looks like Python operating on data. It isn't, and no Python touches your data at all. Those Python objects are builders. When you call filter, a Python object constructs a description and sends it to the JVM. When you call groupBy, another description. When you call count, the plan is executed. At that point the Python API has done its entire job, and what runs is a plan in the JVM, optimized by Catalyst using exactly the same rules it would apply to Scala, compiled to Java bytecode by whole-stage code generation, and run over binary rows on the executors. Count the Python processes involved in processing your data: zero. They're sitting idle, as they were at the start. And that's why pure DataFrame PySpark is not slower than Scala. Not nearly as fast, not within a few percent — the same, because it is literally the same generated code running over the same bytes. The language you wrote the description in has been discarded long before any data moved. I'd like this to land as more than trivia, because it has a practical consequence. It means that for the overwhelming majority of data engineering work — reading, filtering, joining, aggregating, writing — choosing Python costs you nothing at all. The performance argument for Scala, which people still make, applies to a specific and avoidable situation. And that situation is the next section.",
}

export const theUdfCrossing: Section = {
  id: 'the-udf-crossing',
  title: 'The UDF crossing',
  scene: 'pyb-udf-crossing',
  focus: 'exec',
  slide: `## The UDF crossing

\`\`\`python
@udf("string")
def clean(s):
    return s.strip().lower()
\`\`\`

Now Spark has a problem. That function is **Python**. It can't be compiled into a Java loop, translated, or inspected. The only way to run it is to run Python.

### So two things happen
1. The driver **serialises your function** with \`cloudpickle\` — the function *and everything it closes over*
2. On every executor, the idle Python process **wakes up**, and rows start leaving the JVM

### The closure gotcha
\`cloudpickle\` captures what your function references. A UDF that reads a 500 MB local dictionary ships that dictionary **to every task**, repeatedly.

\`\`\`python
lookup = load_big_dict()      # 500 MB, on the driver
@udf("string")
def f(x): return lookup[x]    # now shipped, per task
\`\`\`

> Use \`broadcast()\` for that — once per executor, not once per task.`,
  narration:
    "Here's where it changes. You write a user-defined function — say, one that strips whitespace and lowercases a string — and register it as a UDF. Spark now has a problem it cannot solve cleverly. That function is Python. It's arbitrary Python: it could import a library, open a file, do anything. Spark can't compile it into a Java loop, can't translate it, can't even inspect it to see what it does. The only way to run Python is to run Python. So two things happen. First, on the driver, your function gets serialised using a library called cloudpickle. And cloudpickle is thorough — it captures not just the function but everything the function references from its enclosing scope. Second, on every executor, that idle Python process wakes up, receives your function, and starts receiving rows. Now let me flag the closure gotcha, because it causes real production incidents and the failure is confusing. Suppose you load a lookup dictionary on the driver — five hundred megabytes of reference data — and your UDF refers to it. Cloudpickle sees that reference and includes the whole dictionary in the serialised closure. Which means five hundred megabytes gets shipped with the function. Not once per executor — potentially once per task, and you might have thousands of tasks. Jobs die at startup, or crawl, and the code looks completely innocent. The fix is to wrap that data in a broadcast variable, which Spark ships once per executor and caches. But the general lesson is: look at what your UDF closes over, because all of it is travelling.",
}

export const theRoundTrip: Section = {
  id: 'the-round-trip',
  title: 'The round trip, per row',
  scene: 'pyb-round-trip',
  focus: 'ratio',
  slide: `## The round trip

What happens to **one row** when a plain Python UDF touches it:

1. **Read in the JVM** — an \`UnsafeRow\`, compact bytes
2. **Serialise** — pickle it into Python's format
3. **Write to a socket** — a real OS pipe, with syscalls
4. **Deserialise** — build a Python object
5. **Your function runs** ← *the only step you wanted*
6. **All of it, backwards** — pickle, socket, unpickle

Then again for the next row. A million times per partition.

### The ratio that explains everything
**Five steps of transport around one step of work.**

And step 5 is usually trivial — an addition, a string method. You're paying for a process boundary to perform a single arithmetic operation, per row.

> Typical cost: **10–100×** slower than the same logic as a built-in. Not a constant factor to shrug at.`,
  narration:
    "Let's trace exactly what happens to one row, because the sequence is the whole explanation. The row starts in the JVM as an UnsafeRow — compact binary, laid out contiguously, the format we want everything to stay in. Step one, it's read. Step two, it's serialised: converted from that binary layout into Python's pickle format, which means allocating and encoding. Step three, it's written to a socket. That's a real operating system pipe, with real system calls. Step four, on the other side, Python deserialises it and constructs an actual Python object — which, if you remember the object-overhead problem, is exactly the expensive representation Spark worked so hard to avoid. Step five, your function runs. Step six, all of that happens again in reverse: the result gets pickled, written back through the socket, read by the JVM, and converted back into a binary row. Now count. Five of those six steps are transport. One is work. And here's what makes it worse: step five is almost always trivial. Add one. Strip a string. Compare to a threshold. You are paying for a full process-boundary crossing, twice, with two serialisations and two deserialisations, in order to perform a single arithmetic operation. Then you do it again for the next row, a million times per partition. The measured cost is typically ten to a hundred times slower than the same logic expressed as a built-in function, depending on how trivial your function is — and the more trivial it is, the worse the ratio, because the overhead is fixed and the work approaches zero.",
}

export const theMemoryProblem: Section = {
  id: 'the-memory-problem',
  title: 'Spark cannot manage memory it handed to Python',
  scene: 'pyb-memory',
  focus: 'fail',
  slide: `## Memory Spark can't manage

Spark sizes, tracks and **spills** the JVM heap. It can do none of those things to a Python process.

| | |
|---|---|
| **The JVM heap** | measured · spills to disk when full |
| **The Python process** | unmeasured · **cannot spill** |

Python's memory is outside every accounting Spark does.

### So the failure arrives from outside Spark
The container exceeds its limit and **the kernel kills it.**

\`\`\`
Container killed. Exit code 137.
\`\`\`

No Java exception. No stack trace. Nothing in the driver log that explains it — because from the JVM's point of view, nothing went wrong. It was shot.

### Budget for it explicitly
- \`spark.executor.memoryOverhead\` — non-heap room in the container
- \`spark.executor.pyspark.memory\` — a cap for the Python workers

> An executor running 5 tasks may run **5 Python processes**, each with its own copy of whatever your function loaded.`,
  narration:
    "There's a second cost that isn't about speed at all, and it produces the most confusing failure in PySpark. Spark is careful about JVM memory. It knows how much execution memory a task has, it tracks usage, and when a task exceeds its budget, it spills to disk and carries on — slower, but alive. That's the whole design. None of that applies to Python. Spark hands rows across a socket to a process it does not manage, does not measure, and cannot control. If your Python function builds a large list, or loads a model, or accumulates state, Spark has no visibility into any of it and no mechanism to spill it. Python just allocates, and keeps allocating. So the failure, when it comes, arrives from outside Spark entirely. The container exceeds its memory limit, and the operating system kills it — on Kubernetes you'll see OOMKilled and exit code one-three-seven. And here's what makes it so hard to debug: there is no Java exception. No stack trace. Nothing in the driver log that explains it. Because from the JVM's perspective nothing went wrong; it was shot from outside. You get an executor that vanished and a job that failed, with no error describing why. The fix is to budget for it explicitly. There's memoryOverhead, which is non-heap room inside the container, and there's a PySpark-specific memory setting that caps the Python workers. And one detail worth knowing: an executor running five tasks concurrently may be running five separate Python processes, each with its own copy of whatever your function loaded. Multiply accordingly.",
}

export const codegenLost: Section = {
  id: 'codegen-lost',
  title: 'What the UDF breaks around itself',
  scene: 'pyb-codegen-lost',
  focus: 'with',
  slide: `## What it breaks around itself

### Without a UDF
\`\`\`
*(1) Project
+- *(1) Filter
   +- *(1) FileScan
\`\`\`
All \`*(1)\` — one fused, generated Java loop.

### With one Python UDF in the middle
\`\`\`
*(2) Project
+- BatchEvalPython [clean(…)]     ← no *
   +- *(1) FileScan
\`\`\`
\`BatchEvalPython\` has **no asterisk**. It's a wall. The loop that held three operators is now two loops with a process boundary between them.

### And it's opaque to the optimizer too
A filter expressed *inside* a UDF can't be pushed down — Catalyst can't read it.

\`\`\`python
df.filter(my_udf(col("x")))   # nothing pushes down
df.filter(col("x") > 10)      # pushed into the scan
\`\`\`

> So the cost isn't only running your function. It's everything around it that now can't be fused, reordered, or pushed.`,
  narration:
    "There's a third cost, and it's the one people miss entirely, because it's not about the UDF — it's about everything near it. Look at a plan without a UDF. Project, Filter and FileScan all carry asterisk bracket one, meaning they were fused into a single generated Java loop. One pass, values in registers, no intermediate rows. Now insert one Python UDF. The plan gains a node called BatchEvalPython, and crucially it has no asterisk. It cannot be part of a code generation stage, because there's nothing to generate — the logic isn't available to Spark. So it becomes a wall. What was one fused loop is now two separate loops with a process boundary in the middle, and rows have to be fully materialised on both sides of it to cross. You didn't add the cost of one operator; you broke the loop that contained three. And there's a second version of the same problem, at the optimizer level rather than the code generation level. If you express a filter inside a UDF — pass a column to your function and filter on the result — Catalyst cannot push that down into the scan, because it has no idea what your function does. It might return anything. So the file reader reads every row, the UDF runs on every row, and then rows get discarded. Write the same condition as a plain column expression and it gets pushed all the way into the Parquet reader, and most rows are never read at all. Same logic, same result, and the difference is whether the optimizer could see it.",
}

export const arrow: Section = {
  id: 'arrow',
  title: 'Arrow: stop converting',
  scene: 'pyb-arrow',
  focus: 'arrow',
  slide: `## Arrow

The fix isn't a faster pickle. It's to **agree on one memory layout both sides can read**, and stop converting at all.

**Apache Arrow** is a columnar in-memory format. The JVM writes an Arrow batch; pandas and NumPy read that same memory directly.

\`\`\`
spark.sql.execution.arrow.pyspark.enabled = true
\`\`\`

| | |
|---|---|
| **Columnar** | a column at a time, not a row |
| **Batched** | ~10,000 rows per crossing |
| **One layout** | no per-row conversion, either direction |

### What changes
Transport cost stops scaling with your **row** count and starts scaling with your **batch** count. 10,000× fewer crossings.

And your code gets to be **vectorised** — you receive a pandas Series and operate on the whole column with NumPy, instead of looping.

> Two wins at once: the crossing is amortised, *and* the work itself gets faster.`,
  narration:
    "So how do you fix this? The instinct is to find a faster serialisation format — swap pickle for something quicker. That's the wrong idea, because it still converts every row, twice. The right idea is to stop converting at all. Apache Arrow is a columnar in-memory format, and the key property is that it's a standard both sides already speak. The JVM can write data directly in Arrow layout. Pandas and NumPy can read Arrow layout directly. So there's no translation step in either direction — the bytes the JVM wrote are the bytes Python reads. You turn it on with one configuration setting, and in recent Spark versions it's on by default for the operations that use it. Three properties matter. It's columnar, so you get a column at a time rather than a row at a time. It's batched — around ten thousand rows cross at once rather than one. And it's one shared layout, so there's no per-row conversion cost at either end. What changes is the shape of the cost. Transport used to scale with your row count: a billion rows meant a billion crossings. Now it scales with your batch count: a billion rows at ten thousand per batch is a hundred thousand crossings. Four orders of magnitude fewer. And there's a second win that's easy to overlook. Because you now receive a whole column as a pandas Series rather than one value at a time, your own code can be vectorised — you operate on the entire column with NumPy, which runs as compiled C over contiguous memory. So the crossing gets amortised and the work itself gets faster, at the same time.",
}

export const pandasUdfs: Section = {
  id: 'pandas-udfs',
  title: 'Pandas UDFs: one line different',
  scene: 'pyb-pandas-udfs',
  focus: 'code',
  slide: `## Pandas UDFs

Arrow is the transport. A **pandas UDF** is how you write against it.

\`\`\`python
@udf("double")                      # per ROW
def plus_one(v: float) -> float:
    return v + 1.0

@pandas_udf("double")               # per BATCH
def plus_one_fast(s: pd.Series) -> pd.Series:
    return s + 1.0
\`\`\`

Same Python. Same answer. Typically **an order of magnitude** apart.

### The type hints are not documentation
They're how Spark decides **which kind of UDF this is**:

| Signature | Kind |
|---|---|
| \`Series → Series\` | scalar |
| \`Series → scalar\` | aggregate |
| \`Iterator[Series] → Iterator[Series]\` | iterator (next section) |

Get the hint wrong and you get an error at registration — which is the good outcome.

> \`s + 1.0\` on a Series is NumPy over a contiguous column. The loop is in C, not Python.`,
  narration:
    "Arrow is the transport mechanism. A pandas UDF is how you write code that uses it. Here are the two versions side by side. The plain UDF is decorated with udf, takes a float, returns a float, and Spark calls it once per row. The pandas version is decorated with pandas_udf, takes a pandas Series, returns a pandas Series, and Spark calls it once per Arrow batch — with about ten thousand rows in that Series. Same Python, in the sense that the logic is identical. Same answer. And typically an order of magnitude apart in speed, for a change of one decorator and one type hint. Now, the type hints. These are not documentation, and this is the thing to actually remember from this section. Spark reads your type hints to decide which kind of pandas UDF you've written. Series to Series means a scalar UDF — one value out per value in. Series to a plain scalar means an aggregate UDF, which you use inside a groupBy dot agg. And Iterator of Series to Iterator of Series means an iterator UDF, which we'll come to next. If you get the hint wrong, you get an error at registration time, and that's genuinely the good outcome — the alternative would be silently getting the wrong kind. One more thing worth appreciating. When you write s plus one point zero on a pandas Series, that's not a Python loop adding one to ten thousand values. It's NumPy, operating on a contiguous block of memory, with the loop running in compiled C. So you've eliminated the per-row crossing and the per-row Python interpretation, both.",
}

export const iteratorAndMap: Section = {
  id: 'iterator-and-map',
  title: 'Setting up once: iterator UDFs and friends',
  scene: 'pyb-iterator-map',
  focus: 'iter',
  slide: `## Setting up once

A scalar pandas UDF is called **once per batch** — so anything expensive inside it happens once per batch too.

Load a 2 GB model in there, and you load it every 10,000 rows.

### Iterator UDFs
\`\`\`python
@pandas_udf("double")
def predict(it: Iterator[pd.Series]
           ) -> Iterator[pd.Series]:
    model = load_model()      # ONCE per partition
    for s in it:
        yield pd.Series(model.predict(s))
\`\`\`

Everything before the loop runs **once per partition.** The right shape for a model, a connection, or any expensive setup.

### And two that take whole frames
| | |
|---|---|
| \`mapInPandas\` | DataFrame in, out. Row count may differ. |
| \`applyInPandas\` | one **group** at a time — it must fit in memory |

> \`applyInPandas\` inherits skew directly: one huge group is one huge pandas DataFrame.`,
  narration:
    "There's a shape problem left. A scalar pandas UDF is called once per batch, which is much better than once per row — but it means anything expensive inside the function also happens once per batch. If your function loads a machine learning model, and your partition has a million rows in a hundred batches, you've loaded that model a hundred times. For a two-gigabyte model, that's fatal. The answer is an iterator UDF. You declare it as taking an Iterator of Series and returning an Iterator of Series. Now everything you write before the loop runs exactly once, per partition. Load your model there. Open your database connection there. Then inside the loop, you receive one batch at a time and yield one result per batch. That's the correct shape for anything with expensive setup, and it's worth reaching for as soon as your function has any initialisation at all. There are two more variants worth knowing about, for when a single Series is the wrong shape. mapInPandas gives your function a whole pandas DataFrame — all the columns — and lets you return a DataFrame with a different number of rows, so you can filter or explode. And applyInPandas operates on one group at a time, after a groupBy, which is what you want when your logic genuinely needs a whole group together. But note the warning on that last one. applyInPandas loads an entire group into memory as a pandas DataFrame. So it inherits skew directly and brutally: if one group has forty percent of your rows, that's one enormous pandas DataFrame on one executor, and no amount of Spark memory management will help, because it's Python's memory.",
}

export const theDecision: Section = {
  id: 'the-decision',
  title: 'The decision, in order',
  scene: 'pyb-decision',
  focus: 'ladder',
  slide: `## The decision, in order

Stop at the first that works. The ordering isn't style — **each rung down gives up something the engine was doing for you.**

| | | Gives up |
|---|---|---|
| **1** | a built-in function | — |
| **2** | a SQL expression | — |
| **3** | a pandas UDF | codegen fusion, pushdown |
| **4** | a plain Python UDF | *and* batching |

Most of what people write UDFs for already exists: \`regexp_extract\`, \`when/otherwise\`, \`split\`, \`from_json\`, date arithmetic. **Check the function list first.**

### And check which one you actually got
The plan names it, so there's no need to guess:

| | |
|---|---|
| \`BatchEvalPython\` | the per-row path |
| \`ArrowEvalPython\` | the vectorised path |

> If you expected a pandas UDF and the plan says \`BatchEvalPython\`, Arrow isn't being used — and that's worth ten seconds to check.`,
  narration:
    "Let's finish with a decision procedure, because the individual facts are only useful if they turn into a habit. Four options, and you stop at the first one that works. First: a built-in function. This is the answer far more often than people expect, and it's worth being blunt about — most of what people write UDFs for already exists. Regular expression extraction, conditional logic with when and otherwise, splitting strings, parsing JSON, date arithmetic, null handling. Spark has hundreds of built-in functions, and every one of them stays in the JVM, fuses into generated code, and can be optimized. Check the function list before you write a UDF. Second: a SQL expression. If there's no single built-in but you can compose the logic from built-ins, that's still a tree Catalyst can read and optimize. Third: a pandas UDF. Now you're leaving the JVM, so you've given up code generation fusion and predicate pushdown — but you're crossing in batches with Arrow, so the transport cost is amortised and your code vectorises. Fourth: a plain Python UDF. Same losses as the pandas UDF, plus you've given up batching too. This is the last resort, not the default. And then verify, because guessing is unnecessary. Run explain and look at the operator name. BatchEvalPython means the per-row path. ArrowEvalPython means the vectorised path. If you wrote what you thought was a pandas UDF and the plan says BatchEvalPython, then Arrow isn't being used — maybe a type isn't supported, maybe a config is off — and that's ten seconds of checking that can be worth an order of magnitude.",
}
