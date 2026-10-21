# Apache Spark — from one machine to production

**Status: reset on 2026-10-21 and re-planned around one PySpark project, built step by step.**
Courses are authored one at a time, each reviewed by the owner on its rendered routes before the next
begins. All 12 courses (91 sections) are authored and await the owner's review; no narration audio
exists yet.

## The idea

The course builds **one application — a retail sales pipeline in PySpark — from an empty folder to a
tested, monitored job that also runs as a stream**, and every Spark idea is taught at the moment the
pipeline first needs it. Courses are named by **what we build**, not by API area, so the whole course
is one story a learner can hold in their head:

> *Why Spark → how it runs → start the project → read the data → transform it → write the results →
> look underneath → make it correct → read its plans → make it fast → make it continuous → ship it.*

| Part | For | Leaves you able to |
| --- | --- | --- |
| 0 — The picture (Courses 1–2) | everyone | say when distributing a workload pays, and what Spark does with your code |
| I — Build it (Courses 3–7) | someone who knows Python and basic SQL | write a working batch job, from raw events to partitioned Parquet |
| II — Make it right (Courses 8–10) | someone who can write a job | trust its results, read its plans, and find what makes it slow |
| III — Keep it running (Courses 11–12) | someone who owns a job | run it continuously, recover it, and run it in production |

Audience and scope are unchanged from the previous plan: learners who can read Python functions and
collections and introductory SQL. Distributed computing is introduced here. General Python,
comprehensive SQL, platform administration and ML algorithms are separate subjects. MLlib, GraphX,
SparkR, DStreams, pandas API on Spark, connector internals, custom stateful APIs and table-format
internals stay out of scope.

## The spine: `retail-pipeline`

A retail chain's stores emit **order events**, one JSON line per event: `order_id`, `store_id`,
`amount`, `status`, `event_time`. The pipeline **reads** a day of events and the store reference
data, **cleans** them (keeping the good, reporting the bad), **enriches** each order with its
store's city, **summarises** completed sales per city and day, and **writes** the summary as Parquet
partitioned by day. Later the same logic runs **continuously** on arriving files, with watermarks and
a checkpoint.

The worked numbers stay fixed across the whole course:

- **The six-order sample** (2026-10-01): o1 7 40.00 COMPLETED, o2 7 25.00 COMPLETED,
  o3 9 60.00 CANCELLED, o4 9 15.00 COMPLETED, o5 12 80.00 COMPLETED, o6 7 10.00 PENDING; stores
  7 Leeds, 9 York, 12 Hull. Every on-screen result is produced from it.
- **The production workload**: ~200 GB of events a day, ~70 TB a year; a scan at an assumed 2 GB/s
  per machine (70 TB ≈ 10 h on one machine, ≈ 12 min on 50).
- **The execution example**: 200 GB ÷ 128 MB (`spark.sql.files.maxPartitionBytes`) ≈ 1,600 input
  partitions; 50 executors × 4 cores = 200 slots, so 8 waves; shuffles land in 200 partitions
  (`spark.sql.shuffle.partitions`) before AQE coalesces them.
- **Messy events** (Course 8): a truncated line, an order without an amount, one without a status,
  `"12,50"`, an unknown store 15, a resent o4, an update to o2, an order at 23:30 UTC.
- **Generated data** (Courses 9–10): 1,000,000 and 10,000,000 orders written by the project's own
  `tools/make_orders.py`, so the plans and timings come from files the learner can regenerate.
- **The stream** (Course 11): ten events in four files; 10-minute windows and a 10-minute watermark.

Money is a `DECIMAL(10,2)` from the moment the schema is declared, and the course says why.

The finished project, toured in Course 3 and built from an empty folder from there on:

```
retail-pipeline/
  .venv/                         the project's own Python, with PySpark           (3)
  requirements.txt               pyspark==4.0.1                                   (3 → 12)
  conf/log4j2.properties         Spark's logs at WARN, so the terminal is readable (3)
  conf/spark-defaults.conf       settings outside the code                        (12)
  data/raw/orders/               one file of order events per day                 (4)
  data/raw/stores.csv            store id → city                                  (4)
  data/out/daily_sales/          the summary, Parquet, partitioned by day         (6)
  jobs/daily_sales.py            the batch job                                    (3 → 7)
  jobs/live_sales.py             the same summary, as a stream                    (11)
  pipeline/                      the package, once the rules outgrow one file     (8)
    session.py                   one way to build a SparkSession                  (8)
    schemas.py                   the declared schemas                             (8)
    clean.py                     parse, validate, deduplicate                     (8)
    enrich.py                    the store join                                   (8)
    summarise.py                 sales per city and day                           (8)
    quality.py                   the invariants a run must satisfy                (8 → 12)
  tools/make_orders.py           generated orders, for plans and timings          (9 → 10)
  tests/                         pytest with a local SparkSession                 (12)
  submit.sh                      spark-submit with a packed environment           (12)
```

## Three kinds of frame

Every section is **one full-screen frame and one narration** (90–180 s), no slide.

1. **Concept frame** — a diagram: machines and partitions, the driver and its executors, a DAG cut
   into stages, a timeline of watermarks. Courses 1–2 are mostly these; later courses use one where
   an idea has no file (cluster managers, deploy modes).
2. **IDE frame** — the default from Course 3 on, and ONE fixed template so every panel sits at the
   same place in every section: the **explorer** (the project tree) on the left, the **editor** with
   one file in the centre, the **terminal** docked under it with the real command and its real
   output, and a **side pane** on the right for the lesson's key points (`src/scenes/ide.ts`, the
   python-ct template with a taller terminal, because a Spark job's evidence is what it prints).
   One file per frame — two versions of a file are two sections.
   - The tree grows with the course: a file appears, marked `NEW`, when the step that needs it
     arrives; the open file is highlighted.
   - A file under ~18 lines is shown whole; a longer one shows this section's lines highlighted, the
     rest collapsed to `··· N lines` with real line numbers.
3. **IDE + model frame** — the same template, with the side pane holding what the terminal cannot
   show: partitions on executors, a plan as a tree of operators, stages and tasks, a state store.

## How a section teaches

- **One step per section.** A section makes one change to the pipeline and shows its effect.
- **Code is executed, not pasted.** The spine lives in this repo as real snapshots of
  `retail-pipeline/`, one per section that changes it (`spine/<course>/<step>/`). Scenes import the
  file text from the snapshot, and `npm run check:spine` fails when a terminal pane differs from what
  the code actually prints on PySpark 4.0.1.
- **Failure is taught, not hidden.** Many sections run the wrong version first, show the real error,
  then fix it.
- **Evidence over assertion.** Where Spark's behaviour is the point (a job that did not run, a stage
  boundary, a retried task), the code prints the evidence — job counts, partition counts, stage
  ids, plan text — rather than the narration claiming it.
- **Narration explains; the frame shows.** It never reads code aloud line by line.

## The courses — 12 courses, 91 sections

Every topic of the previous plan's eight chapters is kept; the map from old chapter to new course is
at the end.

### Part 0 — The picture

**1. `why-spark` · Why Spark · 5 sections**
1. When one machine is not enough — a day's summary in pandas, and what 200 GB a day does to it
2. Scale up or scale out — one bigger machine against many ordinary ones, and what each costs
3. Partitions and locality — split the data, send the code to it, move as little as possible
4. From MapReduce to Spark — why keeping the pipeline in memory changed the field
5. What we will build — Spark's scope, the `retail-pipeline`, and the course as its map

**2. `how-spark-runs` · How Spark runs your code · 8 sections**
1. What happens when you run a PySpark job — the whole path in one picture
2. Driver, executors and the cluster manager — who does what, and local mode as one JVM
3. Classic Spark and Spark Connect — the same query through Py4J and through gRPC
4. Transformations, actions and lazy evaluation — a plan is built; nothing runs until an action
5. Partitions and parallel tasks — one task per partition, as many at once as there are cores
6. Narrow and wide dependencies — where a row must move to another partition
7. Jobs, stages and tasks — an action cut at its shuffles, counted from the running job
8. A failed task, recomputed — lineage rebuilds one partition, not the job

### Part I — Build it (IDE frames)

**3. `start` · Start the project · 6 sections**
1. The finished project, toured — every folder and file, and what it is for
2. A new project — a virtual environment, PySpark, and the Java it runs on
3. The first SparkSession — `jobs/daily_sales.py`, and quiet logs
4. The REPL beside the editor — trying a line of PySpark before writing it down
5. An `AnalysisException` — found while the plan is built, before any job runs
6. An error inside a job — found when the action runs, on an executor

**4. `read` · Read the data · 5 sections**
1. DataFrames and rows — the six orders as a DataFrame, its schema and `show()`
2. Reading JSON — a day of events, and what schema inference guesses
3. An explicit schema — `DECIMAL` for money, `TIMESTAMP` for time, and why inference is not enough
4. Reading CSV — the stores, headers and types
5. Files, Parquet and JDBC — what each source promises about schema, splitting and pushdown

**5. `transform` · Transform it · 7 sections**
1. Columns and expressions — `col`, arithmetic, `alias`, `withColumn`
2. Built-in functions — dates, strings and conditionals without leaving the engine
3. Filter and select — keeping the completed orders and the columns we need
4. Group and aggregate — sales per store
5. Joining the stores — the city on every order, and the join type
6. Spark SQL and temporary views — the same summary as a query
7. Tables and the catalog — `saveAsTable`, the warehouse folder, and what a view is not

**6. `write` · Write the results · 5 sections**
1. Writing Parquet — formats, `mode`, and the folder Spark writes
2. Partitioned output — `partitionBy("day")` and the layout on disk
3. Bringing results to the driver — `collect`, `take`, `toPandas` and their limits
4. Side effects in tasks — `foreachPartition`, and why a retried task repeats them
5. The whole batch job — read, clean, enrich, summarise, write, end to end

**7. `underneath` · Look underneath: RDDs · 4 sections**
1. RDDs and lineage — the same summary one level down, and `toDebugString()`
2. Pair RDDs — `reduceByKey` against `groupByKey`, counted in shuffled records
3. Closures, broadcast variables and accumulators — what a function takes to an executor
4. Choosing an abstraction — RDD, DataFrame, SQL, and the typed Dataset Python does not have

### Part II — Make it right

**8. `correct` · Make it correct · 9 sections**
1. Schema enforcement and evolution — the package arrives; a new field and a changed type
2. NULL and malformed records — `PERMISSIVE`, `DROPMALFORMED`, `FAILFAST`, and a quarantine
3. Casts and ANSI mode — `"12,50"` fails loudly in 4.0; `try_cast` and decimals
4. Join cardinality — a duplicated store row doubles revenue
5. Window functions — the latest event per order, and ranking within a city
6. Dates, timestamps and time zones — the 23:30 UTC order lands on which day?
7. Nested data — arrays, maps and structs; `explode` and its trap
8. Built-ins, Python UDFs and pandas UDFs — what each costs at the plan boundary
9. The invariants — `quality.py` checks every run against the rules of this course

**9. `plans` · Read the plan · 6 sections**
1. From code to plans — `explain(mode="extended")`: parsed, analyzed, optimized, physical
2. Analysis — names, types and expressions resolved against the catalog
3. Optimisation and strategy — pushdown, pruning, and the join Spark chose
4. Code generation and memory — `*(n)` whole-stage codegen and unified memory
5. Exchanges and stages — where the plan is cut, matched to the stages that ran
6. A plan and its trace — the final AQE plan beside the REST API's stages

**10. `fast` · Make it fast · 12 sections**
1. A correct baseline — representative data, a checksum, and the median of three runs
2. The Spark UI and its metrics — finding the expensive stage
3. CPU, memory, spill, I/O and scheduling — reading the symptom from the metrics
4. Partition sizes and parallelism — a sweep of `spark.sql.shuffle.partitions`
5. Shuffles and repartitioning — `repartition` against `coalesce`, and the one-file trade
6. Join strategies — broadcast, sort-merge, shuffle-hash, and how Spark estimates size
7. Data skew — one hot store, five mitigations, and the task-time quantiles
8. Caching and persistence — recompute against cache, and what it costs to keep
9. Data layout — file sizes, partition pruning and predicate pushdown
10. Adaptive Query Execution — the plan changed at runtime, and the evidence
11. Executor resources and dynamic allocation — cores, memory and the scheduler
12. Before and after — one change at a time, the same checksum, and what the numbers cannot say

### Part III — Keep it running

**11. `stream` · Make it continuous · 13 sections**
1. Bounded and unbounded data — the daily job as an incremental query
2. The streaming engine — micro-batches, offsets, and `lastProgress`
3. Sources and sinks — what each promises about replay and output
4. Triggers — `processingTime`, `availableNow`, once, and continuous
5. Event time and processing time — when an order happened against when we saw it
6. Event-time windows and late data — the 09:00 window across four batches
7. Watermarks — 08:58 → 09:07 → 09:13 → 09:21, and what they let go
8. State and its growth — deduplication with and without a watermark
9. Output modes — append, update, complete, and the queries each allows
10. Stream-static and stream-stream joins — stores to orders, payments to orders
11. Checkpoints and restarts — what the folder holds, and which changes it survives
12. Delivery guarantees — a replayable source, an idempotent `foreachBatch`, and a crash
13. The whole timeline — late events, duplicates, state and a restart in one run

**12. `ship` · Ship it · 11 sections**
1. Packaging and configuration — `spark-submit`, a packed environment, and config precedence
2. Deploy modes and the driver — client against cluster, and where the driver lives
3. Cluster managers — standalone, YARN and Kubernetes: who is responsible for what
4. Capacity and cost — executor sizing and the year-long backfill in machine-hours
5. Tests and data-quality checks — `tests/` appears; pytest with a local SparkSession
6. Logs, event logs and the history server — diagnosing a run after it ended
7. Failures, retries and speculation — what Spark retries, and what it cannot undo
8. Table formats — what Parquet folders do not guarantee, and what a table format adds
9. Backfills and safe releases — dynamic partition overwrite, schema changes, rollbacks
10. Security boundaries — identities, encryption, secrets, and the exposed ports
11. The finished pipeline — the whole tree, every decision, and the open risks

## Old chapter → new course

| Previous chapter | Now |
| --- | --- |
| 1 Foundations (5) | `why-spark` 1–5 |
| 2 Architecture (8) | `how-spark-runs` 1–8; the annotated local application is `start` 3 |
| 3 Abstractions (12) | `read` 1–5 (schemas, sources), `transform` 1–7 (expressions, aggregation, SQL, catalog), `write` 1–5 (writing, collection, side effects, worked case), `underneath` 1–4 (RDDs, closures, choosing) |
| 4 Correctness (9) | `correct` 1–9 |
| 5 Query plans (6) | `plans` 1–6 |
| 6 Performance (12) | `fast` 1–12 |
| 7 Streaming (13) | `stream` 1–13 |
| 8 Production (11) | `ship` 1–11 |

## Decisions (resolved)

1. **Spine**: `retail-pipeline` — the retail order-event pipeline the previous plan already used as
   its recurring example, now one real project.
2. **Version**: Apache Spark **4.0.1** (the fixed documentation baseline,
   <https://spark.apache.org/docs/4.0.1/>), PySpark from pip, run on **Python 3.13** and **OpenJDK
   21**. Every output on screen was produced by that stack in local mode; anything that cannot run on
   one machine (YARN, Kubernetes, cluster deploy mode) is a concept frame and says it is taken from
   the documentation.
3. **Language**: PySpark. Spark Connect is contrasted where its client boundary changes behaviour;
   typed Datasets appear only as a Scala comparison.
4. **Third-party dependencies**: PySpark only until Course 7; pandas and pyarrow arrive with pandas
   UDFs (Course 8), pytest with tests (Course 12).
5. **Measurements**: timings are real, tied to the machine they were measured on, reported as the
   median of three after a discarded warm-up, and never claimed as a universal speed-up.
6. **Folding**: the editor holds 18 rows; a longer file shows this section's lines and folds the rest.
