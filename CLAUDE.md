# CLAUDE.md — apache-spark

> The workspace-level `CLAUDE.md` (one level up, in `graphl-workspace`) holds the invariants that
> span every repo. This file is only what is true *here*.

## What this repo is

The GraphL concept app for **Apache Spark — from one machine to production**: one course path built
around one spine application (`retail-pipeline`, a retail chain's order-event pipeline in PySpark)
shown in real code. A **section** is `(scene, narration)` — one full-screen frame and one segment of
the course video. Sections are **scene-only** (no `slide`): the frame carries the code, its real
output and the mental model side by side.

`docs/APACHE-SPARK-COURSE-PLAN.md` is the source of truth for scope, audience, courses, sections and
the spine. Author from it; do not drift from its section lists. The method is python-ct's (its
`PYTHON-COURSE-PLAN.md`), applied to Spark.

The render engine is `@graphlearning/flow`; the app shell is `@graphlearning/shell`. Both are
**published packages pinned by version** (flow ^2.2.0, shell ^0.13.1). This repo's own surface is
`src/content/`, `src/scenes/`, `src/main.tsx`, `src/theme.css` and `spine/` — nothing else.

## Route contract

- Slug **`apache-spark`** — the vite `base` (`/apache-spark/`), the path under `graphl.in`, and the
  GitHub repo name once it is renamed from `apache-spark-ct`. All three must be the same string.
- `#/` is the catalog. A section is `#/<courseId>-<sectionId>`, e.g. `#/how-spark-runs-jobs-stages-and-tasks`.
- `?capture=1` and `window.__scene.plan()` are the recorders' hooks and come from the shell.
- Section ids are unique within a course; scene ids are unique across the whole repo.

## Course arc and status

**Reset on 2026-10-21**: every course, scene and wav of the previous 8-chapter, slide-based course
was deleted, and the subject re-planned as 12 courses, 91 sections, named by what we build. The plan
maps every old chapter to its new course, so no topic was dropped.

| # | Course id | Course | Sections | Status |
| --- | --- | --- | --- | --- |
| 1 | `why-spark` | Why Spark | 5 | authored, awaiting owner review (no narration audio yet) |
| 2 | `how-spark-runs` | How Spark runs your code | 8 | authored, awaiting owner review (no narration audio yet) |
| 3 | `start` | Start the project | 6 | authored, awaiting owner review (no narration audio yet) |
| 4–12 | | see the plan | 72 | not started |

Every output on screen was produced here by **PySpark 4.0.1** on **Python 3.13** and **OpenJDK 21**,
in local mode. Course 1's one runnable frame and Course 2's scripts are not the spine: they live in
`spine/why-spark/` and `spine/how-spark-runs/` (the `project` key in `step.json`), shown in the same
IDE template. Dates and version history are from the Spark release notes and papers, not measured.
The production workload (200 GB a day, 70 TB a year, 2 GB/s per machine) is the course's fixed
assumption, stated as such on screen.

## The spine: code is executed, not pasted

From Course 3 on, every code and terminal pane comes from `spine/<course>/<step>/`: `project/` is a
snapshot of `retail-pipeline/` at that step, `session.txt` is the terminal transcript, `step.json`
says where it starts, whether a venv exists, which requirements set it borrows, and which generated
files to `capture`. Scenes import these files with Vite's `?raw`, so a frame can only show what was
replayed. `npm run check:spine` (`scripts/spine.py`) replays every step in a fresh copy — one bash
per step so `cd` and `activate` carry over, REPL lines typed into a real pty — and fails on any
difference; `--write` regenerates the transcripts after an edit, and a path prefix
(`python3 scripts/spine.py start/05`) limits it. Paths are normalised to `/home/ana/retail-pipeline`.

What is Spark-specific in the replay, and why (all of it is about the machine, never the code):

- **PySpark is installed once per requirements set** (`spine/requirements.txt`, `pandas.txt`,
  `connect.txt`) into `.spine-cache/` and borrowed by each step's fresh `.venv` through a `.pth`
  file, so a step does not reinstall 400 MB. A session that types `pip install` still runs it for real
  (`start/02` does). A traceback frame inside PySpark is shown at its path inside `.venv`.
- **`JAVA_TOOL_OPTIONS` is removed** (this container's proxy settings would print a `Picked up`
  line), **`SPARK_LOCAL_IP=127.0.0.1`** (no hostname warning) and **`TZ=UTC`**.
- **Output is wrapped at 84 columns** — the terminal pane's width at the editor's width — as a real
  terminal that wide wraps it. A longer line would widen the centre column and move the side pane.
- **The quiet logs are the PROJECT's**: `conf/log4j2.properties` (WARN and above, one line per event
  — a lost task would otherwise print a 40-line stack trace) and `conf/spark-defaults.conf` (no
  progress bar), found through `SPARK_CONF_DIR`, which every job sets on its own first lines. The
  one line Spark cannot silence is `WARNING: Using incubator modules: jdk.incubator.vector`, printed
  by the JVM on Java 17+; it is on screen in every run, and Course 2 §1 explains it.
- **Run one replay at a time.** A second Spark on the machine takes port 4040, and the step that
  prints its web UI address (and every step, through a `could not bind` warning) changes.

**Run it with Python 3.13 as `python` and Java 17 or 21 as `java` on PATH.** A different
interpreter changes `pyvenv.cfg`, traceback paths and some error text; a different JDK changes
`java -version`; the check reports exactly that.

IDE frames are built with `ideFrame()` in `src/scenes/ide.ts`: python-ct's ONE fixed template with a
taller terminal — explorer (300) | editor (80 columns × 18 rows, 467) over terminal (14 lines, 379) |
side pane (520) — so every panel sits at the same pixels in every section. A file longer than the
editor is folded with `show`, never allowed to grow the pane; a run longer than the terminal is
folded with `fold(session, head, tail)`, which keeps the first and last lines around a
`··· N lines` mark, the way a real terminal shows the END of a long error. The template is 1632 × 856,
1.91:1, fitted edge to edge, and every side card is stretched to 520 — a side card whose content is
wider than 520 widens the column and re-scales the whole frame. `check-render.mjs` fails any IDE
frame whose explorer, editor, terminal or side pane moves.

Source layout per course: `src/content/<course>/NN-<section-id>.ts` plus `index.ts`;
`src/scenes/<course>/` plus `index.ts` exporting `<course>Scenes`; `public/audio/<course>/`.

## Verification notes (read before trusting a number)

- **Every code snippet and printed output is run before it is written down**, on the pinned stack.
  Never present an unrun output.
- **PySpark 4 prints a JSON log entry before every DataFrame error** (`DataFrameQueryContextLogger`),
  then the traceback. It is real and it is long — fold it, never edit it.
- **Show results in order**: `show()` of an unordered DataFrame is not guaranteed to come back in the
  same order on every run. `orderBy` anything a frame prints.
- **Spark's ids are deterministic for a fixed script** (expression ids `#1`, `plan_id`) but change
  when lines before them change. Re-run the step after any edit.
- **AQE changes job and stage counts.** `count()` and `show()` may run more than one job; a frame
  that counts jobs uses `collect()`, or turns AQE off and says so.
- **Timings are not deterministic.** Round them, tie them to the machine, mark the step `volatile`,
  and make no universal speed-up claim.
- **No narration audio exists.** `.wav` files come only from the Colab + Chatterbox pass.

## Authoring conventions

- **Spark 4.0.1 is the fixed baseline.** Check every API name, config key, default and behaviour
  claim against <https://spark.apache.org/docs/4.0.1/>. ANSI mode is on by default.
- **PySpark, classic.** Spark Connect is contrasted where its client boundary changes behaviour.
- Teaching method per section: objective → mental model → annotated code and its real result →
  failure/alternative contrast → bridge. Explain a term before relying on it.
- **Author wide, not tall.** A scene is fitted to the 16:9 frame; lay concept frames out left to
  right, and give a tall chain `cols` or a row.
- **Fill the frame with content, not spacing**: real code, real output, worked numbers.
- **One idea per frame.** Narration is flowing prose and never reads code aloud line by line; when it
  names a line number, that number is the file's.
- **Code lines stay within 80 columns** — the editor is 80 wide, and a longer line widens it.
- **Out of scope** (per the plan): MLlib, GraphX, SparkR, DStreams, pandas API on Spark, connector
  internals, custom stateful APIs, table-format internals, cloud administration.

## Invariants — do not break

- **Never write `x` or `y`.** Scenes are declarative: nodes, edges, nesting. `computeLayout` is not
  exported, so there is no way around this, and that is the point — reproducible frames.
- **Do not reimplement the shell.** `SectionView`, `CourseIndex`, `SlidePanel` and the hooks are
  withheld on purpose. The route contract is what every recorder drives, and it holds only if every
  repo composes the pieces identically.
- **`SiteHeader` goes on the catalog page only** — never on a section. A section is a video frame.
- **Three stylesheets, in cascade order**, imported in `main.tsx`. The order is load-bearing:
  1. `@graphlearning/flow/styles.css` — the node styles plus the IBM Plex faces the engine is
     *calibrated* to (`codeMetrics` sizes code from a measured 9.02px glyph advance). Carries `.tok-*`.
  2. `@graphlearning/shell/styles.css` — the shell paints the canvas.
  3. `./theme.css` — this repo's three brand tokens. **Last, or the brand loses to the defaults.**
- **`file:../ui-flow` / `file:../ui-shell` must never be committed.** Local engine work only; CI has
  no sibling checkout.
- **Narration is never hand-produced.** `.tts` → `.wav` via Colab + Chatterbox only.

## Layout rules the frames actually care about

`npm run check` (`check-content.mjs` + `check-render.mjs`) catches silent failures — each builds
green and breaks only on screen:

- **Text that leaves its node is caught by rendering, not modelling.** Under flow 2.x cards grow to
  fit their text; `check-render.mjs` measures the real frame at 3840×2160. Unbreakable tokens are
  still the thing to watch — `_`, `.` and `/` are **not** break opportunities in CSS.
- **A `focus:` that names no node in its scene is a silent no-op** — nothing lights up.
- **A list is a framed card with bullets.** `framed` is inherited, so set it on the list's PARENT
  (`ideFrame` frames every side pane). Only prose cards and lists read `framed`.
- **`icon:` names are NOT guarded.** A wrong name type-checks, passes `check`, builds, and renders
  the pattern's default glyph. The engine's `icon-gallery` fixture lists every valid key (brand marks
  include `spark`, `hadoop`, `java`, `python`, `pandas`, `parquet`, `kafka`, `kubernetes`). Avoid
  `monitor` and `users`: Azure tiles shadow those lucide names.
- **A section with no wav narrates silence** and records a silent segment. Audio resolves purely by
  convention: `public/audio/<course>/<section-id>.wav`.

What `check` does *not* model: an edge label landing on top of a card. Look at the route.

## Guards before handing over

```sh
npm run build && npx tsc --noEmit && npm run check && npm run check:spine
```

`check-render.mjs` launches Chrome; as root (a container) it passes `--no-sandbox`, and
`PUPPETEER_EXECUTABLE_PATH` picks the browser if puppeteer has none of its own. All four are a
**floor, not proof** — they pass on frames that are visually wrong. The rendered route is the real
bar, and the owner reviews it.

## Working agreement

- **Author the whole unit, then hand over the route.** Scenes, spine steps and narration together.
- **No ASCII sketches of scenes.** A sketch cannot show what the layout engine will do, which is the
  only thing worth looking at.
- **No silent scaffolding**, no work outside the ask. Say plainly what was built, what was verified,
  and what was left out.
