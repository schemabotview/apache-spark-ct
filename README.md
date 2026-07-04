# apache-spark-ct

Video-first content for the **Apache Spark** concept, consumed at runtime by the [`graphl-movie`](../graphl-movie) app. Content only — notebooks, narration (`.tts` → `.wav`), authored one-screen slides (`.slide`: a `# Title`, `## ` sub-labels, short prose, fenced code, and `- `/numbered lists with **bold** key terms), and the wiring `manifest.json`. Nothing to build or run here. For the authoring contract and folder layout, see [`CLAUDE.md`](./CLAUDE.md).

This file is the **course outline** — the human-facing map of modules and sections. It is the plan we author against; the machine source of truth for structure is `manifest.json`.

**Status:** scaffolded + spine agreed (10 modules × ~10 sections — below). **Modules 01 & 02 authored end-to-end** — every section has a per-section notebook + slide + fresh `.tts`, and `manifest.json` wires them onto the `spark-architecture` scene (per-section `focus`/`highlight`). `audio/` is empty by design: the owner generates the `.wav`s from `tts/` via Colab, then the manifest `audio` fields get added back. Module 01 is pushed to the remote; module 02 pending push. Scenes `spark-architecture` (icons added) and `spark-batch-api` (ported) live app-side in `graphl-movie`. Next: modules 03–10.

## Module spine (agreed — 10 modules × ~10 sections)

Re-authored from the graphl-ux-era Spark repo (`../apache-spark-content`, 9 modules of 12–21 sections) into the video shape: **10 modules × ~10 tight teaching sections**, each a narrated slide + scene focus (≈ one page). Key reshaping vs. the source: the oversized "Foundations & Execution Model" (~21) is **split into 01 · Foundations & the Cluster + 02 · The Execution Model** (Spark Connect folded into 02, not its own module); the three fat modules (Transformations 19, SQL/UDFs 19, Streaming 17) are trimmed to ~10 by keeping the ★ spine beats and merging depth items; the silent "What's covered" / self-check / "Summary" scaffolding is dropped and each module's §01 is a real teaching **hook**.

Scene assignment: **01–02 → `spark-architecture`**, **08 → `spark-streaming`**, **all others → `spark-batch-api`** (the shared batch / DataFrame / RDD / SQL / perf master map).

| # | Module | Scene | Sections |
|---|---|---|---|
| 01 | Foundations & the Cluster | `spark-architecture` | 10 |
| 02 | The Execution Model | `spark-architecture` | 10 |
| 03 | RDDs | `spark-batch-api` | 10 |
| 04 | DataFrames | `spark-batch-api` | 10 |
| 05 | Reading & Writing | `spark-batch-api` | 10 |
| 06 | Transformations & Aggregations | `spark-batch-api` | 10 |
| 07 | Spark SQL & UDFs | `spark-batch-api` | 10 |
| 08 | Structured Streaming | `spark-streaming` | 10 |
| 09 | Performance Tuning | `spark-batch-api` | 10 |
| 10 | Pandas API on Spark | `spark-batch-api` | 9 |

Parked (not in the video set): the sample-exam-questions module and the hands-on capstone project — Q&A / open-ended is a weak fit for the narrated-scene format.

## Sections (agreed spine — final headings settle per module as authored)

### 01 — Foundations & the Cluster (10) · `spark-architecture`

1. The problem Spark solves *(hook)*
2. What Spark actually is
3. The cluster — driver, executors, cluster manager
4. Memory-first execution
5. Deployment modes & cluster managers
6. From your code to distributed work — jobs, stages, tasks
7. When NOT to use Spark
8. Your first SparkSession
9. Hello Spark — a multi-step query
10. RDD vs DataFrame vs Dataset — the API stack

### 02 — The Execution Model (10) · `spark-architecture`

1. Lazy evaluation — transformations vs actions *(hook)*
2. Lazy evaluation, in depth
3. The four Catalyst plans
4. Reading plans with `.explain()`
5. Tungsten — whole-stage codegen
6. Adaptive Query Execution (AQE)
7. The DAG — stages & shuffle boundaries
8. Spark Connect — the split-driver architecture
9. Why Spark Connect exists
10. What works (and what doesn't) in Connect mode

### 03 — RDDs (10) · `spark-batch-api`

1. What an RDD actually is *(hook)*
2. Partitions — the unit of parallelism
3. Lineage — recovery from failure
4. Creating RDDs & SparkContext
5. Transformations and actions — RDD edition
6. Narrow vs wide transformations
7. Pair RDDs — the (key, value) view
8. `reduceByKey` vs `groupByKey` — the exam classic
9. Persistence — cache, persist, StorageLevel
10. RDD vs DataFrame — when to reach for each

### 04 — DataFrames (10) · `spark-batch-api`

1. What a DataFrame really is *(hook)*
2. The Spark API hierarchy
3. Schemas — `StructType` vs DDL string
4. Creating DataFrames
5. Exploring a DataFrame
6. Column references — the four ways
7. Common DataFrame operations
8. The three DataFrame types
9. Converting between the three types
10. Default indexes — the most-tested gotcha

### 05 — Reading & Writing (10) · `spark-batch-api`

1. The unified read/write API *(hook)*
2. Reading the four formats
3. Schema inference vs explicit
4. Predicate & projection pushdown
5. Bad-record handling — the `mode` option
6. Write modes
7. `partitionBy` — the partition-pruning win
8. `bucketBy` — join-friendly layouts
9. `saveAsTable` vs `save` — catalog vs filesystem
10. `coalesce` vs `repartition` before writing

### 06 — Transformations & Aggregations (10) · `spark-batch-api`

1. The function library — `pyspark.sql.functions` *(hook)*
2. Column expressions — string, date, array functions
3. Conditional columns — `when` / `otherwise`
4. Combining DataFrames — `union` vs `unionByName`
5. Joins — types, syntax, the duplicate-column trap
6. `groupBy` + `agg`
7. Filtering groups, pivot & unpivot
8. Window functions — concept and spec
9. Ranking — `row_number`, `rank`, `dense_rank`, `ntile`
10. `lag` / `lead` & running aggregates (`rowsBetween` vs `rangeBetween`)

### 07 — Spark SQL & UDFs (10) · `spark-batch-api`

1. SQL is a first-class citizen *(hook)*
2. Temporary views — session, global, managed tables
3. Basic SQL & the catalog API
4. Null semantics — `col == null` always returns null
5. CTEs, subqueries & SQL joins
6. Window functions in SQL
7. DataFrame API vs SQL — same plan
8. Python UDFs — `@udf` and `spark.udf.register`
9. Pandas UDFs — vectorized via Arrow
10. Performance tiers — when to use each

### 08 — Structured Streaming (10) · `spark-streaming`

1. Batch vs Structured Streaming — the mental model *(hook)*
2. "Micro" means time, not data size
3. API parity — what actually changes
4. Your first streaming query — rate → memory sink
5. Sources & sinks
6. Output modes — append, update, complete
7. Triggers — micro-batch cadence
8. Checkpointing & fault tolerance
9. Time, windows & watermarking
10. Stateful ops — joins, dedup, arbitrary state

### 09 — Performance Tuning (10) · `spark-batch-api`

1. Partition sizing — the unit of parallelism *(hook)*
2. `repartition` vs `coalesce` vs `partitionBy`
3. What triggers a shuffle
4. Tuning `spark.sql.shuffle.partitions`
5. AQE in depth — runtime re-optimization
6. Caching DataFrames — `cache()` / `persist()`
7. Checkpointing — truncating long lineage
8. Driver-side bottlenecks — `collect`, `withColumn` in a loop
9. Join strategies & broadcast — when NOT to broadcast
10. Detecting and fixing data skew

### 10 — Pandas API on Spark (9) · `spark-batch-api`

1. Why this API exists *(hook)*
2. Setup & creating a `ps.DataFrame`
3. Three DataFrame types — keep them straight
4. Transformations — lazy, return another `ps.DataFrame`
5. Actions — eager, trigger a Spark job
6. The Spark bridge — `to_spark()` / `pandas_api()`
7. Default index types — the most-tested gotcha
8. Gotchas — where the pandas API ends
9. When to use it vs the Spark DataFrame API

> Note: AQE appears twice by design — a light "what it is" beat in 02 (foundation) and the deep "runtime re-optimization" in 09 (tuning).

## Reference material

- `../apache-spark-content/` — the graphl-ux-era Spark repo: per-module notebooks + `MODULES.md` outline. **Prose reference only** — narration is re-authored fresh here and the owner generates the `.wav`s via Colab (the old repo's `.wav`s are not reused).
- `~/Projects/apache-spark` — the runnable source curriculum (9 notebooks).
- `../databricks-data-engineer-ct/` — the sibling `-ct` template this repo mirrors.
