# Apache Spark — from one machine to production

A **GraphL concept app** for Apache Spark, built on `schemabotview/content-repo-template`. One course
path builds **one PySpark application — `retail-pipeline`, a retail chain's order-event pipeline —
from an empty folder to a tested, monitored job that also runs as a stream**. Each section is a
`(scene, narration)` pair: one full-screen frame that is one segment of the course video.

The content was reset on 2026-10-21. Scope, audience, the spine and every section title are in
[`docs/APACHE-SPARK-COURSE-PLAN.md`](docs/APACHE-SPARK-COURSE-PLAN.md); authoring status is tracked in
[`CLAUDE.md`](CLAUDE.md). The reference version is **Apache Spark 4.0.1**, and every output on screen
was produced by PySpark 4.0.1.

## Courses

| # | Course id | Course | Sections | Status |
| --- | --- | --- | --- | --- |
| 1 | `why-spark` | Why Spark | 5 | authored — awaiting review, no audio |
| 2 | `how-spark-runs` | How Spark runs your code | 8 | authored — awaiting review, no audio |
| 3 | `start` | Start the project | 6 | authored — awaiting review, no audio |
| 4–12 | | read · transform · write · underneath · correct · plans · fast · stream · ship | 72 | planned |

## Run it

```sh
npm install
npm run dev          # http://localhost:5173  ·  routes are #/<course>-<section>
```

## Verify a change

```sh
npm run build && npx tsc --noEmit && npm run check && npm run check:spine
```

`check:spine` replays every terminal pane against PySpark 4.0.1 (Python 3.13 and Java 17/21 on PATH)
and fails on any difference. These are a floor, not proof — open the section's route in the browser.

## Layout

```
docs/                    the course plan
spine/<course>/<step>/   the project at each step: project/, session.txt, step.json
src/content/<course>/    one file per section + the course index
src/scenes/<course>/     declarative scenes (nodes, edges, nesting — never x/y)
src/scenes/ide.ts        the one IDE frame template
src/theme.css            --brand / --brand-hover / --accent-2 — Spark orange + teal
public/audio/<course>/   narration wavs (Colab + Chatterbox only)
scripts/                 spine.py · check-content · check-render · concept.json · titles.json
```
