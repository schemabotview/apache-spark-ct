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

**Scaffolded, nothing authored.** The catalog is empty until the first course lands. The full plan —
14 courses, 149 sections, sources and research debt per course — is in
**[`COURSE-PLAN.md`](./COURSE-PLAN.md)**. Course 5 `shuffle` is first.

## Run it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # production build, base = /apache-spark-ct/
npm run check    # tsc --noEmit
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
