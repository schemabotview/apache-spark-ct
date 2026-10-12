# CLAUDE.md — apache-spark

> The workspace-level `CLAUDE.md` (one level up, in `graphl-workspace`) holds the invariants that
> span every repo. This file is only what is true *here*.

## What this repo is

The GraphL concept app for **Apache Spark**: one concept, 8 courses, 76 sections. A **section** is
`(scene, slide, narration)` and is one segment of the course video. One section = one slide.

The render engine is `@graphlearning/flow`; the app shell is `@graphlearning/shell`. Both are
**published packages pinned by version** (`flow@^1.2.0`, `shell@^0.8.0`). This repo's own surface is
`src/content/`, `src/scenes/`, `src/main.tsx` and `src/theme.css` — nothing else.

## Route contract

- Slug **`apache-spark`** — the vite `base` (`/apache-spark/`), the path under `graphl.in`, and the
  GitHub repo name once it is renamed from `apache-spark-ct`. All three must be the same string.
- Routes: `#/` is the catalog; a section is `#/<courseId>-<sectionId>`, e.g. `#/streaming-watermarks`.
- Audio: `public/audio/<courseId>/<sectionId>.wav`.
- Section ids are unique within a course; scene ids are unique across the whole repo.

## Course arc

The source of truth is `docs/APACHE-SPARK-COURSE-PLAN.md`. Course ids, in syllabus order:

| Course id | Chapter | Sections |
| --- | --- | --- |
| `foundations` | 1 — Foundations of Distributed Data Processing | 5 |
| `architecture` | 2 — Spark Architecture and Execution Model | 8 |
| `abstractions` | 3 — RDDs, DataFrames, and SQL | 12 |
| `correctness` | 4 — Reasoning About Pipeline Correctness | 9 |
| `query-plans` | 5 — Query Plans and Execution Internals | 6 |
| `performance` | 6 — Performance Diagnosis and Optimisation | 12 |
| `streaming` | 7 — Structured Streaming and Stateful Processing | 13 |
| `production` | 8 — Production Engineering and Integrated Reasoning | 11 |

Each numbered item in a plan chapter is exactly one section, in the plan's order.

## Authoring conventions for this subject

- **Spark 4.0.1 is the fixed baseline.** Check every API name, config key, default and behaviour
  claim against <https://spark.apache.org/docs/4.0.1/> while writing — not against the 2018/2020
  books the plan compares with. (For example, ANSI mode is on by default in 4.0.)
- **PySpark is the example language.** Classic PySpark for RDD and execution concepts; Spark Connect
  is contrasted explicitly where its client boundary changes behaviour. Typed Datasets appear only as
  Scala/Java comparisons.
- **The retail order-event pipeline is the recurring example.** Its shared scenes are reused across
  courses with a different `focus:` rather than redrawn. Small contrasting examples are fine when
  they expose a wrong assumption.
- **The teaching method spans a course, not a slide:** objective → mental model → worked code with
  results → misconception/failure contrast → summary → bridge. The bridge to the next course is the
  closing line of the last section's narration.
- **Slides carry what the viewer should be able to re-read, not a transcript of the narration.**
  Each slide states its objective or model, then the section's **worked numbers or example** and
  its **misconception/contrast** as visible blocks — those were narration-only in the first pilot
  draft and left 30–45% of the slide empty. Aim for **850–950** modelled px (rendered ~780–910 of
  1080), never filler: every line must be something the narration says or the plan calls for, and
  every fact added to a slide gets its sentence in the narration.
- **Long identifiers go in code cards, not leaf cards.** `spark.sql.shuffle.partitions` and similar
  cannot wrap (see layout rules below).
- **Out of scope** (per the plan): MLlib, GraphX, SparkR, DStreams, pandas API on Spark, connector
  internals, custom stateful APIs, table-format internals, cloud administration.

## Scene inventory

Each course adds its rows here as it is authored.

| Scene id | Shape | Used by |
| --- | --- | --- |
| `local-daily-summary` | pandas code card → container of four limits | `foundations-workload-limits` |
| `scale-up-vs-out` | storage node → two containers, arithmetic on the edges | `foundations-scale-up-vs-scale-out` |
| `partitions-locality` | dataset → three machine containers of partition chips → combine | `foundations-partitioning-and-locality` |
| `mapreduce-vs-spark` | MapReduce job column beside a PySpark code card | `foundations-mapreduce-to-spark` |
| `retail-pipeline` | **shared.** Sources → `spark-application` (ingest, clean, enrich, summarise) → outputs. Later courses reuse it with `focus:` on a stage id, so keep the ids stable | `foundations-retail-pipeline` |
| `rdd-lineage` | RDD code card → its `toDebugString()` | `abstractions-rdds-and-lineage` |
| `pair-rdd-aggregation` | reduceByKey / groupByKey code → shuffle lineage | `abstractions-pair-rdds` |
| `closures-shared-variables` | closure / broadcast / accumulator code above three cards | `abstractions-closures-and-shared-variables` |
| `dataframe-schema` | read code above printSchema and the six-row `orders` table | `abstractions-dataframes-and-schemas` |
| `column-expressions` | expression code → `enriched.show()` table | `abstractions-columns-and-expressions` |
| `filter-group-aggregate` | daily summary code above result table and result schema | `abstractions-filter-group-aggregate` |
| `sql-and-catalog` | SQL / saveAsTable code above temp view, global view, table | `abstractions-spark-sql-and-catalog` |
| `abstraction-choice` | four `list` cards: RDD, DataFrame, SQL, typed Dataset | `abstractions-choosing-an-abstraction` |
| `reading-sources` | CSV/JSON/Parquet dtypes card above a JDBC read card | `abstractions-reading-sources` |
| `write-output` | partitioned write code → the output directory tree | `abstractions-writing-datasets` |
| `driver-collection` | take/collect/foreachPartition code above a rules list | `abstractions-collection-and-side-effects` |
| `batch-pipeline-case` | sales-by-city code above `stores` and result tables | `abstractions-worked-batch-pipeline` |
| `schema-enforcement` | declared-type table (DECIMAL vs DOUBLE) above a schema-evolution code card | `correctness-schema-enforcement` |
| `malformed-and-nulls` | parse-mode / NULL-comparison code → aggregates table | `correctness-nulls-and-malformed` |
| `ansi-casts` | ANSI on/off table above a `try_*` / decimal code card | `correctness-casts-and-ansi` |
| `join-amplification` | orders and duplicated-stores tables → join result counts | `correctness-join-cardinality` |
| `window-functions` | window code → ranking table and default-frame table | `correctness-window-functions` |
| `timestamps-time-zones` | one instant under three session zones, above LTZ/NTZ + DST code | `correctness-dates-and-time-zones` |
| `nested-data` | nested access / explode code → line-item table and join-trap card | `correctness-nested-data` |
| `udf-boundary` | UDF code → the plan node each one produced | `correctness-builtins-vs-udfs` |
| `edge-case-pipeline` | safe pipeline code above daily table and invariants list | `correctness-worked-edge-cases` |
| `local-app-lifecycle` | the full `daily_sales.py` code card above a 2×2 lifecycle (badged) | `architecture-local-application` |
| `driver-executors` | driver container → cluster manager and executors side by side | `architecture-driver-and-executors` |
| `classic-vs-connect` | Classic and Connect containers (Py4J / gRPC) above a Connect code card | `architecture-classic-vs-connect` |
| `lazy-plan` | lazy code card above transformation and action `list` cards | `architecture-lazy-evaluation` |
| `partitions-to-tasks` | 200 GB → ≈1,600 partition chips → 200 slot chips | `architecture-partitions-and-tasks` |
| `narrow-vs-wide` | narrow lanes stacked over a wide all-to-all, both as chip graphs | `architecture-narrow-and-wide` |
| `job-stage-task` | write() → Job 0: Stage 0 (scan, filter, partial sum) → shuffle → Stage 1 | `architecture-jobs-stages-tasks` |
| `task-recovery` | five badged recovery steps beside a "what lineage does not cover" list | `architecture-trace-and-recompute` |

The retail workload's numbers are fixed across the course: **~200 GB of order events a day,
~70 TB for a year**, scans at an assumed **2 GB/s per machine** (70 TB ≈ 10 h on one, ≈ 12 min on 50).

Layout lessons from the pilot: the scene pane is roughly square, so a long left-to-right chain of
four or more cards renders too small to read. Stack it in a `TB` container instead. An edge between
two adjacent nodes has no room for a label. `cols` on a container is ignored once that container
has internal `edges`, so a chain cannot be wrapped into a grid. Markdown **tables are unstyled** by
the shell (cells run together, and `check` does not model them), so write worked numbers as a
sentence or a bullet instead. An edge that skips a layer (A → C past B) is routed straight through
B; give the skipped node no edge of its own into C so the engine puts it beside C instead. When a
scene renders as a thin strip, set `cols: 1` on its containers: a narrower shape scales up to fill
the pane.

The execution example is fixed too: 200 GB a day ÷ 128 MB (`spark.sql.files.maxPartitionBytes`)
≈ **1,600 input partitions**; **50 executors × 4 cores = 200 slots**, so **8 waves**; shuffles land in
**200** partitions (`spark.sql.shuffle.partitions`) before AQE coalesces them.

From Chapter 3 on, worked results come from the **six-order sample** — o1 7 40.00 COMPLETED,
o2 7 25.00 COMPLETED, o3 9 60.00 CANCELLED, o4 9 15.00 COMPLETED, o5 12 80.00 COMPLETED,
o6 7 10.00 PENDING; stores 7 Leeds, 9 York, 12 Hull — and every output shown on screen was produced
by **PySpark 4.0.1** run locally (`pip install pyspark==4.0.1`, Java 17/21), not predicted. Re-run
the example before changing a result.
Chapter 4 extends it with deliberately messy events (a truncated line, o8 without an amount, o9
without a status, o10's `"12,50"`, o7 at unknown store 15, a resent o4, an o2 update, o4 at
23:30 UTC). When running pandas or Python UDFs, set `PYSPARK_PYTHON` to the same interpreter as the
driver — the workers otherwise start the system `python3`, which may lack pyarrow, and pin
`pandas<3` for PySpark 4.0.1.

**Code cards: keep lines to ~52 characters.** A card's longest line sets its width, and the scene
scales down to fit the widest node — one 70-character line with a trailing comment shrank whole
scenes. Put comments on their own line and wrap calls. Likewise a row of side-by-side result nodes
(table beside code) sets the width; stack them with `cols: 1` instead. A `table` node whose row
repeats a value (`15.00 | 15.00`) logs a React duplicate-key warning from the engine; it renders
correctly.

## Invariants — do not break

- **Never write `x` or `y`.** Scenes are declarative: nodes, edges, nesting. `computeLayout` is not
  exported, so there is no way around this, and that is the point — reproducible frames.
- **Do not reimplement the shell.** `SectionView`, `CourseIndex`, `SlidePanel` and the hooks are
  withheld on purpose. The route contract (`#/<courseId>-<sectionId>`, `?capture=1`,
  `window.__scene.plan()`) is what every recorder drives, and it holds only if every repo composes
  the pieces identically.
- **`SiteHeader` goes on the catalog page only** — never on a section. A section is a video frame.
- **Three stylesheets, in cascade order**, imported in `main.tsx`. The order is load-bearing:
  1. `@graphlearning/flow/styles.css` — react-flow plus the IBM Plex faces the engine is
     *calibrated* to. `codeMetrics` sizes code nodes from a measured 9.02px glyph advance, so a
     different monospace face mis-sizes every code card. Carries the `.tok-*` colours.
  2. `@graphlearning/shell/styles.css` — the shell paints the canvas (`--bg: #1a1d23`; SceneView
     draws its dots at `#2a2f38` assuming a dark surface).
  3. `./theme.css` — this repo's three brand tokens. **Last, or the brand loses to the defaults.**
- **`file:../ui-flow` / `file:../ui-shell` must never be committed.** Local engine work only; CI has
  no sibling checkout.
- **Narration is never hand-produced.** `.tts` → `.wav` via Colab + Chatterbox only.

## Layout rules the frames actually care about

`npm run check` (`scripts/check-content.mjs`) models four silent failures — each builds green and
breaks only on screen. Its comments carry the measured constants; the short version:

- **Leaf cards are a fixed 210×96** with a ~134px text column. Only containers grow to fit. Keep the
  `label` to 2 wrapped lines; 2 label lines + 2 sub lines fits. Watch unbreakable tokens — `_`, `.`
  and `/` are **not** break opportunities in CSS, so `snake_case` and paths overflow sideways in a
  way the height model cannot see.
- **Slides do not scale to fit.** Type size is fixed by the frame (`zoom = paneWidth / 806`,
  width-proportional only), so an over-long slide **clips at the bottom** with no error. Budget
  ~1000 design px of modelled height. Bullets cost far more than prose of the same length.
- **A `focus:` that names no node in its scene is a silent no-op** — nothing lights up.
- **`icon:` names are NOT guarded.** The engine's lucide registry is `Record<string, LucideIcon>`
  and does not enumerate its keys, so a wrong name type-checks, passes `check`, builds, and renders
  a card with no glyph. There are ~75 valid keys; copy one off an existing scene rather than
  guessing a lucide name (`volume`, `move`, `maximize` and `git` are all absent, for instance).
- **A section with no wav narrates silence** and records a silent segment. Audio resolves purely by
  convention: `public/audio/<course>/<section-id>.wav`.

What `check` does *not* model: an edge label landing on top of a card. Look at the route.

## Guards before handing over

```sh
npm run build && npx tsc --noEmit && npm run check
```

All three are a **floor, not proof** — they pass on frames that are visually wrong. The rendered
route is the real bar, and the owner reviews it.

## Working agreement

- **Author the whole unit, then hand over the route.** Scenes, slides and narration together.
- **No ASCII sketches of scenes.** A sketch cannot show what the layout engine will do, which is the
  only thing worth looking at.
- **No silent scaffolding**, no work outside the ask. Say plainly what was built, what was verified,
  and what was left out.
