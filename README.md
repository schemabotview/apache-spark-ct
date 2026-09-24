# apache-spark-ct

Apache Spark **internals**, as deterministic diagrams with narration. Not a tutorial course — each
unit answers *how does this actually work*: how the shuffle works, how Spark decides to join, why
your PySpark UDF is slow, how the query gets re-planned while it runs.

Part of [GraphL](https://graphl.in). Deploys to `graphl.in/apache-spark-ct/`.

## The model

**concept ⊃ course ⊃ section.** A **section** is the atomic unit of a video: one **scene** (left,
a react-flow diagram or a code snippet), one **slide** (right, markdown), one **narration** track.
One course publishes as one long-form video; its sections are the chapters.

Scenes are **declarative** — authors list nodes, edges and nesting, and `@graphlearning/flow`
computes every position and size. Never write x/y: deterministic layout is what makes the
screenshots reproducible.

## Status

**All 14 courses authored — 149 sections.** Every one has a scene, a slide and a narration script,
and every frame has been rendered and reviewed.

**No narration wavs yet.** `.tts` → `.wav` runs through Colab + Chatterbox, and that's the remaining
step before anything can be recorded.

The plan — the spine, the sources behind each course, and the copyright line — is in
**[`COURSE-PLAN.md`](./COURSE-PLAN.md)**.

| # | Course | | # | Course |
|---|---|---|---|---|
| 1 | Why Spark exists | | 8 | Why your PySpark UDF is slow |
| 2 | What runs where when you submit a job | | 9 | How Spark decides to join |
| 3 | What an RDD actually is | | 10 | Why Parquet is fast |
| 4 | How a job becomes stages and tasks | | 11 | Where Spark's memory actually goes |
| 5 | How the Spark shuffle works | | 12 | How Spark re-plans while it runs |
| 6 | How Spark turns your query into a plan | | 13 | How Structured Streaming works |
| 7 | Why DataFrames beat RDDs | | 14 | Why a folder of Parquet is not a table |

## Run it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # production build, base = /apache-spark-ct/
npm run check    # tsc --noEmit + the scene linter
npm run frames   # render every section and check it (needs `npm run dev`)
```

The render engine (`@graphlearning/flow`) and app shell (`@graphlearning/shell`) are consumed as
published packages, pinned by version — this repo carries no engine code.

## Layout

```
src/content/    courses → sections (one file per section) + the frozen SPINE registry
src/scenes/     hand-authored scenes + registry
src/main.tsx    mounts <ConceptApp> from @graphlearning/shell
src/theme.css   --brand / --brand-hover / --accent-2 — this repo's whole design surface
scripts/        concept.json · titles.json · the Colab narration notebook
public/audio/   narration wavs, one folder per course
COURSE-PLAN.md  the syllabus, the sources behind it, and the copyright line
```

## Sources

Distilled from four PDFs (Spark: The Definitive Guide; its Databricks preview excerpt; Learning
Spark 1E; study notes on Learning Spark 2E). **Ideas in original words, diagrams drawn from the
mechanism** — no book's figures or prose are reproduced, and no book's name appears on the published
surface. See `COURSE-PLAN.md`'s Appendix for what each source can and cannot carry; roughly a third
of the spine needs grounding in the Spark docs because the books are too old to carry it.
