# Apache Spark — From Foundations to Advanced Reasoning

A **GraphL concept app** for Apache Spark: 8 courses, 76 sections, built on
`schemabotview/content-repo-template`. Each section is one segment of a course video: a scene on the
left (a diagram or a PySpark code card), a slide on the right, and a narration clip.

The syllabus, audience, scope and teaching method are in
[`docs/APACHE-SPARK-COURSE-PLAN.md`](docs/APACHE-SPARK-COURSE-PLAN.md). The reference version is
**Apache Spark 4.0.1**, and every technical claim is checked against its documentation.

## Courses

| # | Course id | Title | Sections | Status |
| --- | --- | --- | --- | --- |
| 1 | `foundations` | Foundations of Distributed Data Processing | 5 | merged — narration audio pending |
| 2 | `architecture` | Spark Architecture and Execution Model | 8 | authored — narration audio pending |
| 3 | `abstractions` | Spark Programming Abstractions: RDDs, DataFrames, and SQL | 12 | planned |
| 4 | `correctness` | Reasoning About Pipeline Correctness | 9 | planned |
| 5 | `query-plans` | Query Plans and Execution Internals | 6 | planned |
| 6 | `performance` | Performance Diagnosis and Optimisation | 12 | planned |
| 7 | `streaming` | Structured Streaming and Stateful Processing | 13 | planned |
| 8 | `production` | Production Engineering and Integrated Reasoning | 11 | planned |

Courses are authored one at a time, one pull request each, in this order.

## Running it

```sh
npm install
npm run dev          # http://localhost:5173
```

Routes are `#/<course>-<section>`, e.g. `#/streaming-watermarks`. `#/` is the catalog.

## Verifying a change

There is no test runner. The bar is all four:

```sh
npm run build        # must be clean
npx tsc --noEmit     # must be clean
npm run check        # content budgets: card overflow, slide clipping, dead focus, missing wavs
```

…and **the section looked at in the browser**. The three commands pass on frames that are visually
wrong; the rendered route is the real bar.

## What is in here

```
docs/           the course plan
src/content/    courses → sections (one file per section) + registry
src/scenes/     hand-authored scenes + registry
src/main.tsx    mounts <ConceptApp> from @graphlearning/shell
src/theme.css   --brand / --brand-hover / --accent-2 — Spark orange + teal
scripts/        check-content.mjs · colab notebook · concept.json · titles.json
public/audio/<course>/    narration wavs (Colab + Chatterbox, never by hand)
.github/workflows/deploy.yml    Pages deploy on push to main
```

The render engine (`@graphlearning/flow`) and the app shell (`@graphlearning/shell`) are published
packages pinned by version. `file:../ui-flow` / `file:../ui-shell` must never be committed.

## Deployment

The slug is **`apache-spark`**: vite `base` is `/apache-spark/` and the site's path is
`graphl.in/apache-spark`. GitHub Pages serves a project site at the **repo name**, so the GitHub repo
must be renamed from `apache-spark-ct` to `apache-spark` before Pages is enabled (Settings → Pages →
Source = GitHub Actions). Until Pages is enabled, the deploy job fails at `configure-pages`, after
`npm ci` and `npm run build` have already passed.
