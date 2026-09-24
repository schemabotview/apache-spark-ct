# COURSE-PLAN.md — the syllabus

> Written 2026-09-24, moved into the repo at scaffold. The concept → course → section tree for this
> repo, expanded from the spine reviewed in the workspace's `SPARK-CT-PLAN.md`, which records why
> these fourteen courses and not others. The Appendix at the foot carries the parts an author needs
> without leaving the repo.
>
> **ALL FIFTEEN COURSES AUTHORED — 162 of 162 sections**, each verified on its rendered frame.
> Courses 1–14 were authored to this plan; course 15 `capstone` was ported in from the `apache-spark`
> repo on 2026-09-24 — see §"The capstone port" below.
> 45 narration wavs of 162 — `origins`, `topology`, `rdd` and `execution` fully voiced, `shuffle`
> started, and 5 of `capstone`'s carried over with the port. `.tts` → `.wav` via Colab + Chatterbox
> is the owner's step and is under way.
> The fifteen **course ids are frozen**
> in `src/content/index.ts` —
> the published slug is `<courseId>-<sectionId>` and that is the route contract every recorder
> drives, so an id cannot move once its course exists. **Section ids are not frozen**: they can
> change until the course they belong to is authored.
>
> Each line is one **section** = one scene + one slide + ~40s of narration. Each course publishes as
> **one long-form video**, its sections as chapters from the wav manifest.

**162 sections across 15 courses.** Per-course source keys: `LS1` = Learning Spark 1E ·
`SDG` = Spark: The Definitive Guide (full) · `EX` = the Databricks excerpt, figures only ·
`2E` = the Learning Spark 2E study notes · `DOC` = Spark docs / specs, i.e. research required.

---

## 1 · `origins` ✅ — "Why Spark exists (and what MapReduce got wrong)"
*8 sections · sources: 2E 1, SDG 1, EX ch.2*

| | section | the beat |
|---|---|---|
| 01 | `the-single-machine` | one box, one disk — where it stops, and why |
| 02 | `ship-code-to-data` | GFS and MapReduce: move the program, not the terabytes |
| 03 | `the-disk-tax` | every map/reduce pair round-trips to disk; what that does to iteration |
| 04 | `the-engine-zoo` | Hive, Storm, Impala, Giraph, Mahout — one engine per workload |
| 05 | `the-bet` | keep MR's parallelism and fault tolerance, hold intermediates in memory |
| 06 | `one-engine` | SQL, streaming, ML, graph on one core — and why that composes |
| 07 | `compute-not-storage` | Spark deliberately owns no storage; what that buys and costs |
| 08 | `the-timeline` | 2009 AMPLab → 2013 ASF → 2.0 structured → 3.0 adaptive |

## 2 · `topology` ✅ — "What actually runs where when you submit a Spark job"
*10 sections · sources: SDG 15, LS1 7, 2E 1–2, **EX p.5 / p.7** (best-drawn in the excerpt)*

| | section | the beat |
|---|---|---|
| 01 | `three-processes` | driver, executors, cluster manager — who owns what |
| 02 | `the-driver` | holds the DAG, schedules work, tracks state; the single point of failure |
| 03 | `sparksession` | the entry point, and the four contexts it replaced |
| 04 | `executors` | a JVM per worker; cores as slots; what it reports back |
| 05 | `the-cluster-manager` | granting resources ≠ scheduling tasks — two different jobs |
| 06 | `local-mode` | the same processes as threads; why it is not a toy |
| 07 | `client-vs-cluster` | where the driver lands, and why it changes everything |
| 08 | `on-kubernetes` | driver pod, executor pods, dynamic allocation |
| 09 | `spark-submit` | what the command actually does, in order |
| 10 | `failure-modes` | executor dies vs driver dies — what survives each |

## 3 · `rdd` ✅ — "What an RDD actually is"
*10 sections · sources: **LS1 3–4** (earns its place here), SDG 12–13*

| | section | the beat |
|---|---|---|
| 01 | `five-properties` | partitions · compute · dependencies · partitioner · preferred locations |
| 02 | `the-partition` | a slice of rows on one machine; parallelism = partitions ∩ slots |
| 03 | `immutability` | you describe a new collection; you never mutate one |
| 04 | `lineage` | the DAG *is* the recovery plan |
| 05 | `narrow-dependency` | one parent partition → one child; pipelineable |
| 06 | `wide-dependency` | many parents → one child; the thing that costs |
| 07 | `recompute-not-replicate` | fault tolerance without copying data |
| 08 | `preferred-locations` | data locality, and why the scheduler asks |
| 09 | `pair-rdds` | the key/value shape everything distributed rests on |
| 10 | `when-rdds-still-win` | the 5% the structured API cannot reach |

## 4 · `execution` ✅ — "How a Spark job becomes stages and tasks"
*11 sections · sources: SDG 15, LS1 7–8, 2E 2, **EX p.13–15 / p.19***

| | section | the beat |
|---|---|---|
| 01 | `nothing-happens-yet` | transformations build a plan, not data |
| 02 | `the-action` | what actually triggers a job |
| 03 | `why-lazy-pays` | the optimizer needs the whole chain to be worth anything |
| 04 | `job-stage-task` | the three units, and what bounds each |
| 05 | `the-stage-cut` | stages break at wide dependencies — always |
| 06 | `pipelining` | why three narrow operations cost one pass |
| 07 | `the-task` | one task = one partition of one stage |
| 08 | `slots` | tasks queue; they do not parallelize past available cores |
| 09 | `the-dag-scheduler` | stage submission, retries, and behaviour on failure |
| 10 | `a-real-lineage` | the 7-step `groupBy → sum → sort → limit → collect` chain |
| 11 | `reading-explain` | parsed / analyzed / optimized / physical in the output |

## 5 · `shuffle` ✅ — "How the Spark shuffle works"
*10 sections · sources: **synthesised** — LS1 3–4, SDG 15/19, 2E 2/7, **DOC***

| | section | the beat |
|---|---|---|
| 01 | `why-a-shuffle` | the moment a partition needs data it does not hold |
| 02 | `the-stage-cut` | why the DAG breaks exactly there, and what a boundary costs |
| 03 | `map-side-write` | partitioner → one bucket per reducer; sort, spill, index + data file |
| 04 | `the-exchange` | files land on local disk; the external shuffle service; who serves them |
| 05 | `reduce-side-fetch` | fetch, merge, spill — where the memory cliff actually is |
| 06 | `partition-count` | why 200; too few vs too many; task size as the real unit |
| 07 | `skew` | one key, one task, one hour — the long tail in the stage timeline |
| 08 | `avoiding-it` | broadcast join, bucketing, pre-partitioned sources |
| 09 | `aqe-fixes-it` | Spark 3 runtime coalesce and skew split — and when it still cannot |
| 10 | `reading-the-ui` | shuffle read/write, spill metrics, what a healthy stage looks like |

**07** and **09** are the Shorts; **01** is the thumbnail. Sections 01–02 re-define narrow/wide
in-course, so this stands alone without courses 3 and 4.

## 6 · `catalyst` ✅ — "How Spark turns your query into a plan" ★ runner-up
*12 sections · sources: SDG 4, 2E 3, **EX p.51–53 / p.60 / p.118***

| | section | the beat |
|---|---|---|
| 01 | `one-front-door` | SQL, DataFrame and Dataset compile to the same tree |
| 02 | `the-expression-tree` | `((c+5)*200)-6 < other` as a DAG of operators |
| 03 | `unresolved-plan` | valid syntax, unknown names |
| 04 | `the-catalog` | where table and column names get resolved |
| 05 | `the-analyzer` | resolution, and the errors it is allowed to raise |
| 06 | `rules-to-fixpoint` | a rule is a tree→tree function, applied until nothing changes |
| 07 | `predicate-pushdown` | the rule everyone names — shown firing, with labelled nodes |
| 08 | `column-pruning` | the rule that saves more and gets named less |
| 09 | `physical-candidates` | one logical plan, several physical strategies |
| 10 | `the-cost-model` | how one candidate wins |
| 11 | `down-to-rdds` | the plan becomes RDDs; why Spark is called a compiler |
| 12 | `reading-a-plan` | `explain(mode=…)`; what `Exchange` and `FileScan` tell you |

**Sections 03–09 are the differentiation.** The canonical Databricks figures (EX p.52–53) draw every
plan node as an *empty box* — they show the pipeline but never what changed. These sections carry
the real nodes (`Filter`, `Project`, `Relation`) and name the rule that fired.

## 7 · `tungsten` ✅ — "Why DataFrames beat RDDs"
*10 sections · sources: 2E 6, SDG 4, **DOC** (thin — the excerpt never mentions Tungsten)*

| | section | the beat |
|---|---|---|
| 01 | `the-object-tax` | headers, pointers and GC pressure across a billion rows |
| 02 | `the-binary-row` | `UnsafeRow`: fixed-width slots plus a variable-length tail |
| 03 | `off-heap` | memory Spark manages instead of the JVM |
| 04 | `encoders` | the typed bridge between a JVM object and a binary row |
| 05 | `cache-locality` | the layout, not the code, is the speedup |
| 06 | `the-virtual-call-problem` | interpreter overhead of walking an operator tree |
| 07 | `whole-stage-codegen` | collapsing a whole stage into one generated loop |
| 08 | `seeing-it` | `explain(codegen)`, and the asterisks in the physical plan |
| 09 | `where-it-stops` | UDFs and everything codegen cannot fuse |
| 10 | `the-memory-eras` | Spark 1 static split → 2 unified → 3; what changed and why |

## 8 · `pyspark-boundary` ✅ — "Why your PySpark UDF is slow"
*11 sections · sources: **EX p.7 / p.123** (best figure in the excerpt), SDG 5/32, 2E 12, **DOC** (Arrow)*

| | section | the beat |
|---|---|---|
| 01 | `two-processes` | the JVM and your Python interpreter are not the same program |
| 02 | `py4j` | how the driver's Python talks to the driver's JVM |
| 03 | `the-dataframe-illusion` | pure DataFrame code never leaves the JVM |
| 04 | `the-udf-crossing` | function serialized to workers; a Python process beside each executor |
| 05 | `the-round-trip` | row out, pickle, execute, pickle, row back — per row |
| 06 | `the-memory-problem` | Spark cannot manage memory it has handed to Python |
| 07 | `codegen-lost` | the UDF is opaque; the fused loop breaks around it |
| 08 | `arrow` | columnar batches instead of per-row pickling |
| 09 | `pandas-udfs` | Series in, Series out; the type-hint form |
| 10 | `iterator-and-map` | load the model once — `mapInPandas`, cogrouped map |
| 11 | `the-decision` | built-in > SQL expression > pandas UDF > Python UDF |

## 9 · `joins` ✅ — "How Spark decides to join"
*11 sections · sources: SDG 8, 2E 7*

| | section | the beat |
|---|---|---|
| 01 | `the-problem` | matching rows that live on different machines |
| 02 | `broadcast-hash-join` | ship the small side everywhere; no shuffle at all |
| 03 | `the-threshold` | 10MB — what it measures, and why it is conservative |
| 04 | `sort-merge-join` | both sides partitioned by key, sorted, merged |
| 05 | `shuffle-hash-join` | when a hash table beats a sort |
| 06 | `nested-loop` | the one you never want, and when it is unavoidable |
| 07 | `how-spark-chooses` | the decision order, stated plainly |
| 08 | `join-types-cost` | inner vs outer vs left-anti — what each does to the plan |
| 09 | `bucketing` | shuffle once at write time, join free forever |
| 10 | `skewed-joins` | the hot key, and salting — what people did before AQE |
| 11 | `hints` | `BROADCAST` / `MERGE` / `SHUFFLE_HASH`, and when overriding is right |

## 10 · `formats` ✅ — "Why Parquet is fast"
*11 sections · sources: SDG 9, 2E 4*

| | section | the beat |
|---|---|---|
| 01 | `row-vs-column` | what each layout is actually good at |
| 02 | `inside-a-parquet-file` | row groups → column chunks → pages → footer |
| 03 | `the-footer` | schema plus per-chunk min/max and null counts |
| 04 | `column-pruning` | reading three columns out of two hundred |
| 05 | `predicate-pushdown` | the footer lets Spark skip a row group unread |
| 06 | `encoding-and-compression` | dictionary, RLE — why columnar compresses better |
| 07 | `partitioned-directories` | `year=2024/month=03` is a filesystem index |
| 08 | `two-kinds-of-pruning` | directory-level skipping vs row-group skipping |
| 09 | `the-small-file-problem` | a million tiny files, and what it costs the driver |
| 10 | `schema-evolution` | what Parquet lets you change, and what it does not |
| 11 | `csv-and-json` | why inference costs a pass; when to declare a schema |

## 11 · `memory` ✅ — "Where Spark's memory actually goes"
*11 sections · sources: 2E 7, SDG 19, **EX p.24***

| | section | the beat |
|---|---|---|
| 01 | `the-executor-budget` | reserved, unified, user memory — what each holds |
| 02 | `storage-vs-execution` | one pool, a soft boundary, a borrow rule |
| 03 | `who-wins` | execution can evict storage; storage cannot evict execution |
| 04 | `one-parent-three-children` | the repeated-read problem, drawn |
| 05 | `cache-vs-persist` | the same call — one of them gives you a choice |
| 06 | `storage-levels` | memory/disk × serialized/deserialized × replicated |
| 07 | `what-eviction-does` | LRU on blocks, and the recompute that follows |
| 08 | `checkpoint` | cutting lineage, not caching it |
| 09 | `spill` | when execution memory runs out mid-shuffle |
| 10 | `off-heap` | and why it is not a free win |
| 11 | `reading-the-storage-tab` | fraction cached, and the number that lies |

## 12 · `aqe` ✅ — "How Spark re-plans your query while it runs"
*10 sections · sources: 2E 12 **only** + **DOC** — highest-risk course, must be re-grounded*

| | section | the beat |
|---|---|---|
| 01 | `the-static-plan-problem` | the optimizer guesses before it has seen any data |
| 02 | `materialization-points` | a shuffle is where real statistics first exist |
| 03 | `the-loop` | run a stage, read its stats, re-optimize, repeat |
| 04 | `coalesce-partitions` | 200 reducers for 8MB — fixed at runtime |
| 05 | `strategy-switch` | sort-merge becomes broadcast when a side turns out small |
| 06 | `skew-split` | one huge partition split many ways, its counterpart duplicated |
| 07 | `dynamic-partition-pruning` | building the fact-table filter from the dimension side |
| 08 | `dpp-vs-static-pruning` | a runtime filter, not a plan-time one |
| 09 | `what-it-does-not-fix` | where you still tune by hand |
| 10 | `seeing-it` | initial plan vs final plan in the UI |

## 13 · `streaming` ✅ — "How Structured Streaming actually works"
*12 sections · sources: SDG 20–22, 2E 8 · **ignore LS1 entirely — it is DStreams***

| | section | the beat |
|---|---|---|
| 01 | `the-unbounded-table` | a stream is a table rows get appended to |
| 02 | `the-same-engine` | your batch query, executed incrementally |
| 03 | `the-trigger` | micro-batch, fixed interval, available-now, continuous |
| 04 | `incremental-execution` | what the engine carries between batches |
| 05 | `the-offset-log` | what was read, written down *before* it is processed |
| 06 | `output-modes` | append, update, complete — and what each one requires |
| 07 | `sinks-and-idempotence` | exactly-once needs the sink's cooperation |
| 08 | `event-time` | the timestamp in the row, not the clock on the wall |
| 09 | `windows` | tumbling, sliding, session |
| 10 | `watermarks` | the promise about lateness that lets state be dropped |
| 11 | `the-state-store` | where aggregation state lives, and what checkpoints it |
| 12 | `stream-stream-joins` | why both sides need a watermark |

## 14 · `lakehouse` ✅ — "Why a folder of Parquet is not a table"
*12 sections · sources: 2E 9 **only** + **DOC** (Delta / Iceberg specs)*

| | section | the beat |
|---|---|---|
| 01 | `a-folder-is-not-a-table` | no atomicity, no isolation, no schema enforcement |
| 02 | `the-partial-write` | a job dies halfway and readers see the wreckage |
| 03 | `the-listing-problem` | object storage has no cheap directory listing |
| 04 | `the-transaction-log` | an ordered record of what changed, beside the data |
| 05 | `a-commit` | write the files, then atomically append one log entry |
| 06 | `snapshot-isolation` | a reader pins a version and never sees a tear |
| 07 | `time-travel` | reading version N is replaying the log to N |
| 08 | `schema-enforcement` | the log carries the schema; writes are checked against it |
| 09 | `updates-and-deletes` | copy-on-write vs merge-on-read |
| 10 | `compaction` | small files again — and the log entry that fixes them |
| 11 | `vacuum` | what time travel costs in storage |
| 12 | `the-three` | Delta, Iceberg, Hudi — what actually differs |

---

## 15 · `capstone` ✅ — "Everything, end to end"
*13 sections · **ported**, not authored to this plan · sources: the `apache-spark` repo + **DOC***

| | section | the beat |
|---|---|---|
| 01 | `the-plan` | the Lambda pipeline, whole, before any of it is built |
| 02 | `read-lake` | the reader's surface, and the three prunings it triggers |
| 03 | `clean` | dedup and typing — and why none of it has run yet |
| 04 | `batch-aggregate` | both sides large → sort-merge → a shuffle cuts a stage |
| 05 | `partitioned-write` | layout, file count, format — and the staleness that remains |
| 06 | `ingest` | Kafka as an unbounded input table, with replayable offsets |
| 07 | `enrich` | the same table, the same join API, a broadcast plan |
| 08 | `window` | event-time buckets, and the watermark that bounds state |
| 09 | `real-time-view` | update mode, and the checkpoint that buys exactly-once |
| 10 | `serving` | union the accurate history to the fresh present |
| 11 | `deploy` | where the driver lives, and what the executor flags buy |
| 12 | `tune` | read the Spark UI first; know what AQE already does |
| 13 | `closer` | the whole pipeline, and every part it had to touch |

### The capstone port

**This course did not come from the four books.** It was ported from the `apache-spark` repo on
2026-09-24, where it closed a five-course applied arc, and it is the one **category-B** course here —
it BUILDS rather than explains. It is last in the spine for that reason, and its presence is not a
precedent: courses 1–14 remain the plan.

Three things were fixed in the port, and they are the reason this is not a straight copy:

1. **Cross-course references had to go.** The source repo's narration pointed at its siblings by name
   — "a direct callback to the API course", "remember from the architecture course", "every concept
   from the four courses" — in **eight of the thirteen** sections, plus several slide tags of the form
   `` (`spark-api` §3) ``. Those courses do not exist here under those names, so the pointers were
   broken as well as non-compliant. Each one is replaced by a two-sentence inline explanation of the
   prerequisite, which is what `src/content/index.ts` prescribes.
2. **§12's AQE framing was stale.** It taught AQE as a Spark 3 flag you switch on.
   `spark.sql.adaptive.enabled`, `…coalescePartitions.enabled` and `…skewJoin.enabled` have all
   defaulted to **true since Spark 3.2**, so the section now teaches what AQE is already doing to your
   plan. Same correction as course 12 — Appendix rule 2, re-ground every tuning claim.
3. **The master map was over-full.** It carried a fourth row ("Run it: spark-submit · on a cluster ·
   observe + tune") and rendered at **12.9pt**, under this repo's 13pt floor; dropping that row gives
   13.7pt. `scripts/frames.mjs` caught it — the source repo has no such check, so it shipped there
   unseen. Worth recording: trimming the `sub` strings first moved the type size by **exactly zero**,
   because leaf cards are fixed-size. Only node count moves it.

**Audio.** Course and section ids are verbatim from the source repo, because the slug
(`capstone-<sectionId>`) keys the wav path. That was deliberate: the five sections whose narration
survived the port byte-for-byte — `read-lake`, `partitioned-write`, `enrich`, `real-time-view`,
`serving` — reuse their existing wavs unchanged, verified byte-identical. The other eight were
rewritten and **must be regenerated** before this course can be recorded.

---

## Totals and what they imply

| | |
|---|---|
| Courses | **15** (14 authored here + `capstone`, ported) |
| Sections | **162** |
| Scenes | 161 hand-authored (`capstone`'s two bookends share one) |
| Markdown sources | 162 `.md`, each deriving a `.slide` and a `.tts` |
| Narration wavs | 162, via Colab + Chatterbox — **45 done**, 117 outstanding |
| Long-form videos | 15, chapters generated from the wav manifest |
| Shorts | ~162 available; ~8 per course is the useful cut |

For scale: the largest repo in this workspace today is 47 sections. **This is three times that.**

**So do not commit to 14.** Course ids get frozen now because that is free; authoring is decided one
course at a time. Build order (the frozen SPINE in `src/content/index.ts`):

> **5 `shuffle` → 9 `joins` → 8 `pyspark-boundary` → 12 `aqe` → 10 `formats`**, then 6, 4, 11.

Four of those five answer one search intent — *why is my job slow* — so they publish as a coherent
bundle rather than scattered videos. Course 6 `catalyst` follows despite lower volume, because it
is the clearest case where these diagrams beat the best existing ones.

## Research debt, before the courses that carry it

Not blockers for course 5, but they are real and better named now than discovered mid-course:

| Course | What must be grounded outside the four books |
|---|---|
| 5 `shuffle` | no book has a shuffle chapter — the mechanism is synthesised from scattered passages |
| 7 `tungsten` | `UnsafeRow` layout and codegen; the excerpt never mentions Tungsten |
| 8 `pyspark-boundary` | Arrow batching and the pandas-UDF API as it stands now |
| 12 `aqe` | 2E describes 3.0.0-preview2; skew-join handling changed afterwards |
| 14 `lakehouse` | Delta and Iceberg specs; the 2E notes give one chapter of paraphrase |

---

# Appendix · the sources, and what they can and cannot carry

Condensed from the workspace's `SPARK-CT-PLAN.md`, which holds the full review. Kept here so the
repo is self-contained: an author working inside it should not have to leave to learn that half the
material is a decade stale.

## The four sources (`~/Books/apache-spark/`)

| File | What it really is | Era |
|---|---|---|
| `Spark-The Definitive Guide.pdf` | Chambers & Zaharia, O'Reilly 1st ed. — **the text authority** | 2018 · Spark 2.2 |
| `Apache-Spark-…-Excerpts-R1.pdf` | Databricks free preview of the *unpublished* book, chs. 2–5 — **the figure authority** | 2017 · Spark 2.1 |
| `Learning Spark  Lightning-Fast…` | Karau et al., **1st ed.** — mechanism source only | 2015 · Spark 1.x |
| `Learning_Spark_2E_Study_Notes.pdf` | **Not the book** — 31-page paraphrase of Learning Spark 2E | Spark 3.0 |

**Rules that fall out of that table, and are not negotiable while authoring:**

1. **Never narrate from the excerpt's wording.** It is a pre-release draft of chapters the full SDG
   already covers — 178 of 400 sampled 8-gram windows appear verbatim in the final book, the rest
   was reworded. It also still carries typos the published book fixed. Text comes from the full SDG.
2. **Nothing in the folder is current.** Newest primary source is Spark 2.2; Spark is on 3.5/4.x.
   The excerpt mentions Tungsten, adaptive execution and AQE **zero** times. SDG ch. 19's
   hand-tuning advice predates AQE and is now the fallback, not the answer. Any tuning, deployment
   or API claim must be re-grounded against current docs before it reaches a `.tts`.
3. **Learning Spark 1E is a mechanism source only.** Its chs. 3–4 are still the clearest account of
   partitions, lineage and narrow-vs-wide dependency anywhere in the four. Its API guidance is
   eleven years out of date, and its streaming chapter is DStreams — ignore it for course 13.

## Why the requested book:course / chapter:section mapping was not used

A section is one scene + one slide + ~40s. SDG ch. 15 is 20 pages and six figures — it cannot be a
section. And four sources → four courses would be four overlapping tellings of one subject at four
dates. The mapping here goes one level deeper (chapter → course, chapter-beat → section) and treats
the sources as **layers of one spine**: LS1E for *why the model is shaped this way*, SDG for the
structured era and production depth, the excerpt for *what to draw*, the 2E notes for *what changed
by Spark 3*.

## §8 · The copyright line — the risk went *up* once the figures were opened

`NEXT-PLAN.md`'s line stands: ideas in original words, diagrams drawn from the mechanism. But the
excerpt's 21 figures have now been read, and unseen material cannot be accidentally traced.

- **The excerpt decides *what* to draw, never *how*.** Use it as a checklist of which mechanisms
  earn a diagram.
- **The Catalyst pipeline (excerpt p.51–53) and the UDF figure (p.123) get the most deliberate
  re-derivation**, precisely because they are the most recognisable. For Catalyst that is no
  hardship — labelling the plan nodes is the improvement anyway, and it is already a different
  drawing.
- **The excerpt is a Databricks marketing PDF.** Its typography, palette and layout are theirs.
  `src/theme.css` picks Apache Spark's own orange-and-gold; do not reach for the teal-and-orange.
- Neither book's name appears on the public surface. The published unit is *"How the Spark shuffle
  works"*, never *"Chapter 15, part 3."*

## Where this engine beats the source material

The excerpt's 21 figures are each 2–8 boxes, one nesting level, straight arrows. `ui-flow` renders
that class without strain — so *"we have a layout engine"* is not by itself the differentiation.

This is: **the canonical Catalyst figures draw every plan node as an empty box.** Pages 52–53 show
the pipeline shape — unresolved → resolved → optimized → physical — and never what *changed* at each
step, which is the only interesting part. Course 6 §§03–09 carry the real nodes (`Filter`,
`Project`, `Relation`) and name the rule that fired. That is the checkable claim this repo exists to
make, and it is why course 6 follows the first bundle despite lower search volume.
