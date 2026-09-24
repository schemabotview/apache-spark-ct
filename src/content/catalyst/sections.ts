import type { Section } from '../types'

export const oneFrontDoor: Section = {
  id: 'one-front-door',
  title: 'Three doors, one tree',
  scene: 'cat-one-front-door',
  focus: 'same',
  slide: `## Three doors, one tree

SQL, DataFrames and Datasets all compile to **the same unresolved logical plan.**

\`\`\`sql
SELECT dest, count(*) FROM flights GROUP BY dest
\`\`\`
\`\`\`python
df.groupBy("dest").count()
\`\`\`

Same tree. The optimizer never learns which door you came through.

### Which settles two arguments
| | |
|---|---|
| **"SQL is faster than DataFrames"** | No. Same tree. |
| **"Python is slower than Scala"** | Not on the structured APIs — until you write a **UDF** |

That exception is real and large, but it's the only one. Pure DataFrame code in Python never leaves the JVM.

> Pick the door you can read six months from now.`,
  narration:
    "Before we look inside the optimizer, one fact that settles a surprising number of arguments. SQL, DataFrames and Datasets are three doors into the same building. Write a group-by in SQL, write it with the DataFrame API, write it as a typed Dataset in Scala — all three are parsed into exactly the same thing: an unresolved logical plan. A tree. And from that point on, nothing downstream knows or cares which door you came through. So, two things people argue about, settled. First: SQL is not faster than DataFrames, and DataFrames are not faster than SQL. They're the same tree, optimized by the same rules, executed by the same engine. Use whichever is clearer for the problem in front of you — SQL is often better for a big join-heavy query, the DataFrame API is often better when you're building something up programmatically. Second: Python is not slower than Scala on the structured APIs. This one surprises people, because it's true of almost no other system. When you write a PySpark DataFrame operation, no Python runs on your data at all. The Python API builds a plan, sends that plan to the JVM, and the JVM does all the work. Your rows never touch a Python interpreter. Now — there's one very large exception, and it's worth flagging clearly. A Python user-defined function does run Python on every row, and that changes everything about the performance profile. But that's the exception, not the rule, and it's worth a course of its own. For pure DataFrame code, the language is an ergonomic choice, not a performance one.",
}

export const expressionTree: Section = {
  id: 'the-expression-tree',
  title: 'Everything is a tree',
  scene: 'cat-expression-tree',
  focus: 'lt',
  slide: `## Everything is a tree

\`\`\`
((price + 5) * 200) - 6 < budget
\`\`\`

Becomes a tree of **expression nodes** — and the nesting *is* the precedence. There's no parsing left to do.

| Node | What it is |
|---|---|
| \`<\` \`-\` \`*\` \`+\` | operators, each with children |
| \`price\` \`budget\` | \`AttributeReference\` — a column |
| \`5\` \`200\` \`6\` | \`Literal\` — a constant |

### Why this representation, specifically
A tree is **easy to pattern-match on**. "Find any node whose children are both literals" is a few lines of Scala.

That's the whole reason Catalyst is built this way: optimization becomes *tree rewriting*, and a rule becomes a small, testable, independent function.

> Plans are trees of the same kind — just with \`Filter\` and \`Join\` at the nodes instead of \`+\` and \`<\`.`,
  narration:
    "Catalyst's central representation is the tree, and it's worth seeing one concretely before we talk about what gets done to them. Take an expression: open bracket, open bracket, price plus five, close, times two hundred, close, minus six, less than budget. As a string that's a mess to reason about. As a tree it's completely clear. The root is the less-than comparison. Its left child is the subtraction. That subtraction's left child is the multiplication, whose left child is the addition, whose children are the column price and the literal five. On the right of the root sits the column budget. Three kinds of node. Operators, each with children. AttributeReferences, which are columns — price and budget. And Literals, which are constants — five, two hundred, six. Notice something: the nesting is the precedence. There's no parsing left to do, no operator precedence to remember, no ambiguity. The shape already says what happens first. Now, why build it this way? Because a tree is extremely easy to pattern-match on. If you want to write an optimization that says find any node whose children are both literals and evaluate it now, that's a few lines of Scala against a tree. It would be a nightmare against a string. And that's the key design decision in Catalyst: optimization becomes tree rewriting, which means each rule can be a small, independent, testable function. Plans are trees of exactly the same kind — the same machinery, just with Filter and Join at the nodes instead of plus and less-than.",
}

export const unresolvedPlan: Section = {
  id: 'unresolved-plan',
  title: 'The unresolved plan: valid syntax, unknown names',
  scene: 'cat-unresolved',
  focus: 'plan',
  slide: `## The unresolved plan

The parser's output. **Real nodes, unknown names.**

\`\`\`
'Project ['dest, 'total]
+- 'Aggregate ['dest], [sum('cnt)]
   +- 'Filter ('country = IN)
      +- 'UnresolvedRelation [flights]
\`\`\`

The apostrophe prefix means **unresolved**. Every name in there is a string nobody has checked.

### What it knows
The *shape* is valid: a projection over an aggregate over a filter over a relation. The grammar held.

### What it doesn't
- Is \`flights\` a table? Which one? Where?
- Does \`country\` exist? Is it a string?
- Can \`cnt\` be summed, or is it text?

> This is exactly the line between a **syntax** error and an **analysis** error — and why the two arrive at different moments.`,
  narration:
    "The first thing that exists is the parser's output, called the unresolved logical plan, and the word unresolved is doing a lot of work. You get a real tree. Project at the top, over an Aggregate, over a Filter, over something called UnresolvedRelation. Those are genuine plan nodes with genuine structure. But look at the names in them. In Spark's printed plans, a name with an apostrophe in front of it means unresolved — it's a string that somebody typed, and nothing has checked it against anything. So what does this plan actually know? It knows the shape is valid. You asked for a projection over an aggregate over a filter over a relation, and that's a well-formed thing to ask for. The grammar held. What it doesn't know is essentially everything else. Is flights a table? Is it a view? Does it exist at all, and if so where does it live and what format is it in? Does the column country exist on it? Is country even a string, so that comparing it to the text I-N makes sense? Can cnt be summed, or is it actually a text column, in which case summing it is nonsense? None of that is known. And this is precisely the boundary between two kinds of error that arrive at different times. If you write SELECT FRUM with a typo, that's a syntax error and you never get a tree at all. If you write SELECT dst instead of dest, the grammar is perfectly happy — you get this tree, with an unresolved name in it — and the failure comes at the next stage.",
}

export const theCatalog: Section = {
  id: 'the-catalog',
  title: 'The catalog: the only thing that knows what a name means',
  scene: 'cat-catalog',
  focus: 'stats',
  slide: `## The catalog

The only thing in Spark that knows what a **name** means.

| Holds | Example |
|---|---|
| **Tables and views** | \`flights\` → parquet at \`s3://…\` |
| **Columns and types** | \`dest\` is a string, \`cnt\` is a bigint |
| **Functions** | built-ins, and your registered UDFs |
| **Statistics** | row counts and sizes — *if computed* |

### Where it comes from
- **The session** — temp views, \`createOrReplaceTempView\`. Dies with the session.
- **An external metastore** — Hive, Glue, Unity. Shared, durable, and how other tools see your tables.

### The row that decides your join strategy
**Statistics are optional.** If \`ANALYZE TABLE\` has never run, the optimizer is estimating sizes from compressed file bytes and heuristics.

\`\`\`sql
ANALYZE TABLE flights COMPUTE STATISTICS
\`\`\`

> Cheap to run, rarely run, and the most common reason a join strategy is wrong.`,
  narration:
    "To resolve a name, you need something that knows what names mean. That's the catalog, and it's a more interesting object than it sounds. It holds four things. Tables and views: the name flights maps to a location and a format — parquet files at this S3 path. Columns and their types: dest is a string, cnt is a bigint. Functions: every built-in, plus any user-defined function you've registered. And statistics: row counts, column sizes, distinct-value estimates. Where does it come from? Two places. There's a session-level catalog, which is where temporary views live — anything you create with createOrReplaceTempView is in here, and it dies when the session dies. And there's often an external metastore: Hive, AWS Glue, Databricks Unity Catalog. That one is shared and durable, which is how other tools and other people see the same tables you do. Now the fourth item, statistics, deserves special attention, because it's the one that quietly decides how your queries run. Statistics are optional. If nobody has ever run ANALYZE TABLE on your table, Spark doesn't know how many rows it has. It will estimate from the compressed file size on disk and some heuristics, and that estimate can be off by an order of magnitude — particularly with Parquet, which compresses extremely well. And that estimate is what the cost model uses to decide whether to broadcast a table. So: a missing statistic becomes a wrong size estimate, becomes a wrong join strategy, becomes a job that takes an hour instead of a minute. ANALYZE TABLE is cheap, it's rarely run, and it's the single most common root cause of a bad plan.",
}

export const theAnalyzer: Section = {
  id: 'the-analyzer',
  title: 'The analyzer: binding names to reality',
  scene: 'cat-analyzer',
  focus: 'after',
  slide: `## The analyzer

Walks the unresolved tree, and for every name asks the catalog: **what is this?**

\`\`\`
'Filter ('country = IN)   ← a name
Filter (country#9 = IN)   ← a typed column, with an id
\`\`\`

The apostrophes disappear. \`#9\` is an **attribute id** — unique for the life of the plan, which is how Spark keeps two columns called \`id\` from two tables apart.

It also inserts **casts**, resolves **function names**, and expands \`SELECT *\` into an actual column list.

### Or it refuses — and this is the error you get *fast*
| | |
|---|---|
| \`cannot resolve 'dst'\` | no such column |
| \`Table or view not found\` | no such table |
| \`Reference 'id' is ambiguous\` | both sides of a join have it |

Analysis runs **as you build the plan**, long before any action. That's why a column typo fails immediately while a bad cast waits for \`.show()\`.`,
  narration:
    "The analyzer is the stage that turns names into things. It walks the unresolved tree, and for every name it finds, it asks the catalog: what is this, actually? Before: Filter, apostrophe-country equals I-N. After: Filter, country hash nine, equals I-N. The apostrophe is gone, because country is now bound to a real column with a real type. And that hash-nine is an attribute id — a unique number assigned for the life of this plan. That id is how Spark keeps track of which column is which when you join two tables that both have a column called id. Humans see ambiguity; the plan sees hash-nine and hash-forty-two, and there's no confusion. The analyzer does more than binding. It inserts casts where types need converting. It resolves function names to actual implementations. It expands SELECT star into a real list of columns — which is why a star in a saved view captures the columns as they were at creation time. And crucially, it can refuse. If you reference a column that doesn't exist, you get cannot resolve, along with a list of the columns that do exist, which is genuinely one of Spark's better error messages. If the table isn't there, table or view not found. If you join two tables that both have id and then reference id unqualified, reference is ambiguous. Here's the practical detail worth knowing. Analysis runs as you build the plan — not when you call an action. So a column typo fails immediately, on the line where you wrote it. A bad cast, or a division by zero, waits until an action actually runs. That's why some Spark errors are helpfully local and others arrive two hundred lines later.",
}

export const rulesToFixpoint: Section = {
  id: 'rules-to-fixpoint',
  title: 'A rule is a function from tree to tree',
  scene: 'cat-rules',
  focus: 'example',
  slide: `## A rule is a function from tree to tree

Pattern-match a shape; return a replacement. Nothing more exotic than that.

\`\`\`
(2 + 3) * cnt > 100    ← as written
5 * cnt > 100          ← ConstantFolding fired
\`\`\`

Evaluated **once at plan time**, not once per row. Over a billion rows that's a billion additions saved, for free.

### Rules run in batches, to a **fixed point**
A batch repeats until a full pass changes nothing.

**Why repeat?** Because one rule firing exposes work for another. Fold a constant, and a filter becomes simple enough to push down. Push a filter down, and a column becomes unused and prunable.

**Why it stops:** a pass with no changes — or \`maxIterations\`, which logs a warning if you hit it.

### Why this design matters
Each rule is small, independent, and testable. Adding an optimization to Spark means adding one function — not editing a monolith.`,
  narration:
    "Now we get to the optimizer proper, and the mechanism is simpler than you'd expect. A rule is a function from a tree to a tree. It pattern-matches a shape, and returns a replacement. That's it. Here's the simplest possible example, called constant folding. Suppose your expression contains two plus three, times count, greater than a hundred. The rule says: wherever you find an operator whose children are both literals, evaluate it right now and replace the node with the result. So two plus three becomes five, at planning time. Think about what that saves. Without it, Spark would compute two plus three once for every row in your dataset. A billion rows, a billion pointless additions. The rule removes them all, once, for free. Now, rules don't run once. They run in batches, repeatedly, until a full pass over the tree changes nothing — that's called reaching a fixed point. And the reason is that rules feed each other. Folding a constant can make a filter simple enough that another rule recognises it as pushable. Pushing a filter down can make a column unused, which lets column pruning remove it. So one pass isn't enough; you keep going until the tree stops changing. There's also a maxIterations limit, and if you ever hit it Spark logs a warning, which usually means something pathological about your plan. The reason this architecture is worth admiring is what it does for the people who work on Spark. Adding an optimization means writing one small, independent, testable function and registering it in a batch. You don't have to understand or modify a giant monolithic optimizer. That's why Catalyst accumulated so many optimizations so quickly.",
}

export const predicatePushdown: Section = {
  id: 'predicate-pushdown',
  title: 'Predicate pushdown, actually shown',
  scene: 'cat-pushdown',
  focus: 'after',
  slide: `## Predicate pushdown

The rule everyone names. Here it is, on real nodes.

### Before — as written, read bottom-up
\`\`\`
Filter (country#7 = IN)      ← runs on JOINED rows
+- Join (user#3 = user#9)    ← all 4B rows
   +- Relation flights       ← 4B rows
\`\`\`

### After — \`PushDownPredicate\` fired
\`\`\`
Join (user#3 = user#9)       ← now joins 40M
+- Relation flights
     PushedFilters: [country = IN]
\`\`\`

The filter moved **below the join** and **into the scan**. Those rows are never read, never joined, never materialised.

### Why it's allowed
On an **inner** join, a row that fails the filter could never have contributed to the result. The answer is provably identical.

> On an **outer** join it often isn't — the filtered row still has to appear, padded with nulls. That's why outer joins optimize worse.`,
  narration:
    "Predicate pushdown is the optimization everyone can name, and almost nobody has seen. Let's look at it on real plan nodes. Before. Reading bottom-up: there's a relation, four billion rows of flights. Above it, a join against a user table. Above that, a filter on country equals India. As written, that's: join all four billion rows against all the users, producing an enormous intermediate result, and then throw away everything that isn't India. After the rule fires. The filter is gone from the top. It's moved below the join, and further — it's been pushed into the scan itself, and you can see it as PushedFilters on the relation node. So now the file reader skips non-India rows before they're even decoded, and the join receives forty million rows instead of four billion. That's a hundred-fold reduction in the most expensive operation in the query, from moving one node in a tree. Now here's the part that's usually left out, and it's the interesting bit: why is Spark allowed to do this? On an inner join, a row that fails the filter could never have contributed to the final result. If a flight isn't from India, no amount of joining it to users will make it appear in the output. So moving the filter earlier is provably identical in outcome — the optimizer isn't guessing, it's applying an algebraic law. But change it to a left outer join and the reasoning collapses. In an outer join, a left row that doesn't match still has to appear in the output, padded with nulls. So you can't just drop it early. That's a large part of why outer joins optimize so much worse than inner ones, and it's worth knowing when you're choosing a join type.",
}

export const columnPruning: Section = {
  id: 'column-pruning',
  title: 'Column pruning: the rule that saves more and gets named less',
  scene: 'cat-pruning',
  focus: 'result',
  slide: `## Column pruning

Your query touches **three** columns. The table has **two hundred**.

\`\`\`sql
SELECT dest, sum(cnt) FROM flights
WHERE country = 'IN' GROUP BY dest
\`\`\`

Catalyst walks the tree from the top, collecting which attributes are actually referenced, and narrows the scan to exactly those.

\`\`\`
FileScan parquet [dest#7, country#9, cnt#11L]
  ReadSchema: struct<dest,country,cnt>
\`\`\`

### Why it's worth more than pushdown, often
A columnar format stores each column **separately**. So reading 3 of 200 columns genuinely reads about 1.5% of the bytes — the rest is never touched on disk.

Predicate pushdown skips *rows*. Column pruning skips *columns*. On a wide table, the second is usually the bigger win — and it's the one nobody talks about.

> \`SELECT *\` disables it completely. That's the real cost of a star.`,
  narration:
    "Predicate pushdown gets all the attention. Column pruning usually saves more, and hardly anyone mentions it. Here's the situation. You have a wide table — an events table, two hundred columns, the kind that accumulates over years as people add fields. Your query mentions three of them: dest, country, and cnt. Catalyst walks the plan from the top down, collecting the set of attributes that are actually referenced anywhere, and then narrows the scan node to exactly that set. You can see the result in the plan: the FileScan lists three columns, and ReadSchema confirms it. Now, why does this matter so much? Because of how columnar formats work. Parquet doesn't store rows together; it stores each column's values together, in separate chunks. So if you ask for three columns out of two hundred, the reader seeks to those three chunks and never touches the rest. You're reading roughly one and a half percent of the bytes. Not reading two hundred columns and discarding a hundred and ninety-seven — genuinely not reading them. Compare the two optimizations. Predicate pushdown skips rows. Column pruning skips columns. On a narrow table with a selective filter, pushdown wins. On a wide table — and real analytical tables are wide — pruning usually wins by more. And here's the practical consequence, which is the most actionable thing in this course. SELECT star disables column pruning completely. You've told Spark you need all two hundred columns, so it reads all two hundred. That's the real cost of a star: not verbosity, not style — a hundred-fold increase in bytes read.",
}

export const physicalCandidates: Section = {
  id: 'physical-candidates',
  title: 'One logical plan, several physical ones',
  scene: 'cat-physical',
  focus: 'strategies',
  slide: `## One logical plan, several physical ones

The optimized logical plan says **what**. It says nothing about **how**.

\`\`\`
Join (user#3 = user#9)
\`\`\`

That's a *what*. Here are three *hows*, and they compute exactly the same rows:

| | |
|---|---|
| **BroadcastHashJoin** | ship the small side to everyone. No shuffle. |
| **SortMergeJoin** | shuffle both, sort both, merge |
| **ShuffledHashJoin** | shuffle both, hash one side |

### Identical answers, wildly different cost
Minutes versus hours, on the same data. Nothing about the *logical* plan distinguishes them — the difference is entirely in what they do to the cluster.

Which is the whole reason a **cost model** has to exist: something must choose, and correctness can't.

> Strategies also pick how to aggregate (hash vs sort) and how to scan. Joins are just where the difference is most dramatic.`,
  narration:
    "Here's a distinction that's easy to miss and clarifies a lot once you have it. The optimized logical plan says what you want. It does not say how to get it. Take a node that says: join these two relations where user equals user. That's a complete statement of what. It's also completely silent on how. And there are several hows, all of which produce byte-for-byte identical results. A broadcast hash join ships the entire small side to every executor and probes locally — no shuffle at all. A sort-merge join shuffles both sides by the key, sorts both, and merges them. A shuffled hash join shuffles both sides too, but builds a hash table from the smaller one instead of sorting. Same rows out. Same answer. But the cost difference between them is not marginal — it's minutes versus hours on the same data, because one of them moves nothing across the network and another moves everything twice. And this is exactly why a cost model has to exist. If every physical plan gave a different answer, you'd pick by correctness and be done. They don't. They all give the same answer, so correctness tells you nothing, and something else has to choose. That something is a cost estimate. This is where Catalyst stops being pure algebra — up to this point every rewrite was provably equivalence-preserving — and starts making bets. Joins are where the difference is most dramatic, but strategies make the same kind of choice about how to aggregate, whether by hash or by sort, and how to scan a source.",
}

export const theCostModel: Section = {
  id: 'the-cost-model',
  title: 'The cost model, and its one weakness',
  scene: 'cat-cost-model',
  focus: 'wrong',
  slide: `## The cost model

Candidates are compared on **estimated sizes** — and *estimated* is the load-bearing word.

| Input | How reliable |
|---|---|
| **Catalog statistics** | good — *if* \`ANALYZE TABLE\` ever ran |
| **File sizes** | compressed bytes, 5–10× smaller than memory |
| **Heuristics** | a filter keeps… some fraction? |

Then: *right side under 10 MB → BroadcastHashJoin.*

### The one weakness
A wrong estimate doesn't make Spark choose badly **sometimes**. It makes it choose badly on **every run, identically**, until the estimate changes.

There's no feedback — a static plan never learns it was wrong.

### Two fixes, in order
1. \`ANALYZE TABLE\` — fixes the *cause*
2. **AQE** — re-decides after a shuffle, with measured numbers

> A hint is the third option and the worst: it's a constant, and your data isn't.`,
  narration:
    "So how does Spark choose between physical candidates? It estimates their cost, and the estimate is built from three ingredients of decreasing reliability. Best case, catalog statistics — actual row counts and column statistics, but only if someone ran ANALYZE TABLE. Next, file sizes on disk, which are compressed bytes and can easily be five or ten times smaller than the same data in memory. And then heuristics: if there's a filter, some assumed fraction of rows survive it. Spark doesn't know the real selectivity, so it guesses. From those it computes estimated sizes, and applies rules like: the right side of this join estimates under ten megabytes, so broadcast it. Now here's the weakness, and I want to state it precisely because it's the thing that makes plans go wrong in production. A bad estimate doesn't make Spark choose badly occasionally, in a way you'd notice as flakiness. It makes Spark choose badly deterministically — the same wrong choice, on every single run, forever, until something changes the estimate. Because there's no feedback loop. A statically-planned query runs, takes four hours, finishes, and nothing anywhere records that the plan was wrong. Tomorrow it does exactly the same thing. There are two fixes, in order of preference. First, run ANALYZE TABLE, which fixes the cause: give the optimizer real numbers and it makes real decisions. It's cheap and almost nobody does it. Second, turn on adaptive query execution, which lets Spark re-decide after a shuffle using sizes it has actually measured rather than estimated. There's a third option, which is to force a hint, and it's the worst of the three — a hint is a constant baked into your code, and your data isn't constant.",
}

export const downToRdds: Section = {
  id: 'down-to-rdds',
  title: 'Down to RDDs: Spark is a compiler',
  scene: 'cat-to-rdds',
  focus: 'codegen',
  slide: `## Down to RDDs

The selected physical plan is still a tree of operators. Two things happen to it.

### 1 · Whole-stage code generation
A run of operators is compiled into **one generated Java method**. Scan, filter and project stop being three objects calling each other and become one fused loop.

\`\`\`
*(1) Filter (country#9 = IN)
     ↑ the star marks a codegen stage
\`\`\`

No virtual calls, no intermediate rows, and the JIT can optimize it like handwritten code.

### 2 · RDDs
The result is executed as **RDD operations** — the same partitions, tasks, stages and lineage as everything else. Nothing new runs your query.

### So the whole pipeline is
\`\`\`
SQL/DataFrame → unresolved → analyzed
  → optimized → physical → Java → RDDs
\`\`\`

> That's a compiler. Source language in, optimized target code out — which is exactly why Spark is described as one.`,
  narration:
    "We're nearly at the end of the pipeline. Spark has chosen a physical plan, but that plan is still a tree of operator objects — it isn't yet anything a machine runs. Two things happen. First, whole-stage code generation. Rather than executing the tree by having each operator call the next one — which means a virtual method call per operator per row, and an intermediate row object at every step — Spark generates Java source code that fuses a whole run of operators into a single loop. Scan, filter, project become one method with the filter inlined into the read loop. That gets compiled at runtime. The effect is large: no virtual calls, no intermediate objects, and the JVM's JIT compiler can optimize it the way it would optimize handwritten code. You can see where this applied in the plan, because operators inside a code generation stage are marked with an asterisk and a stage number. Second, the result is executed as RDD operations. And that's a nice place to land, because it means everything from the earlier parts of this subject still applies exactly. The same partitions. The same tasks. The same stages cut at shuffles. The same lineage-based recovery. There is no second execution engine hiding under the structured API — DataFrames are a much better way of describing work, and the work itself runs the way it always did. So look at the whole pipeline. SQL or DataFrame code, to an unresolved plan, to an analyzed plan, to an optimized plan, to a physical plan, to generated Java, to RDDs. Source language in, optimized target code out. That is a compiler, in the ordinary sense of the word, and it's exactly why people describe Spark as one.",
}

export const readingAPlan: Section = {
  id: 'reading-a-plan',
  title: 'Reading all four plans',
  scene: 'cat-reading-plan',
  focus: 'code',
  slide: `## Reading all four plans

\`\`\`
df.explain(True)     # all four
df.explain()         # physical only
\`\`\`

| Plan | Tells you |
|---|---|
| **Parsed** | what you asked for — names only, unresolved |
| **Analyzed** | names bound, types known, \`#ids\` assigned |
| **Optimized** | which **rules fired** — diff it against Analyzed |
| **Physical** | **how** it will run |

### The trick worth having
**Diff Analyzed against Optimized.** Everything that moved, disappeared or got simpler is an optimization that fired. Everything still in the same place is one that *didn't* — and that's usually the interesting part.

### In the physical plan
- \`Exchange\` — a shuffle, a stage boundary. Count them.
- \`*(n)\` — a whole-stage codegen stage
- \`PushedFilters\` / \`ReadSchema\` — did pushdown and pruning actually happen?

> Every claim in this course is checkable here, on your own query, in about ten seconds.`,
  narration:
    "Let's close with how to see all of this yourself, because every claim in this course is checkable in about ten seconds on your own query. Call explain with true and you get all four plans. Parsed shows what you asked for, with unresolved names carrying apostrophes. Analyzed shows the same tree with every name bound to a real column, types known, and attribute ids assigned. Optimized shows what the rules did to it. And physical shows how it will actually run. Now here's the technique that makes this genuinely useful rather than just interesting. Diff the analyzed plan against the optimized one. Everything that moved, disappeared, or got simpler between those two is an optimization that fired — you can see your filter migrate down the tree, watch a Project appear where columns got pruned, see constants collapse. And more importantly, everything that stayed in exactly the same place is an optimization that didn't fire. That's usually the interesting part. If your filter is still sitting above the join in the optimized plan, there's a reason — maybe it's a left outer join, maybe there's a non-deterministic function in the way — and now you know where to look. In the physical plan, three things to scan for. Exchange, which is a shuffle and a stage boundary; count them, because that count is the cost of your query. Asterisk-n markers, which tell you which operators got fused into generated code. And on the scan node, PushedFilters and ReadSchema, which tell you whether predicate pushdown and column pruning actually happened rather than just theoretically applying. That's the whole optimizer, and it's all inspectable.",
}
