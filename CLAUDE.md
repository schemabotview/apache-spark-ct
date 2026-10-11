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
- **Long identifiers go in code cards, not leaf cards.** `spark.sql.shuffle.partitions` and similar
  cannot wrap (see layout rules below).
- **Out of scope** (per the plan): MLlib, GraphX, SparkR, DStreams, pandas API on Spark, connector
  internals, custom stateful APIs, table-format internals, cloud administration.

## Scene inventory

None yet — each course adds a row here as it is authored (scene id, kind, sections that use it).

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
