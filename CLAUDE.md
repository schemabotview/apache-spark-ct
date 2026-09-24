# CLAUDE.md — apache-spark-ct

> Auto-loaded in this repo, so it stays short. The workspace file (`../CLAUDE.md`) carries the
> content model and the invariants — read that first. **The syllabus is `COURSE-PLAN.md`**: 15
> courses, 162 sections, the sources behind each, and the copyright line. Read it before authoring.

## What this is

Apache Spark **internals** — category A of `../NEXT-PLAN.md` ("how X actually works", not how to
use it). Derived from the four PDFs in `~/Books/apache-spark/`, which supply the *ordering* and
never their names. Every course publishes as one long-form search-first video, its sections the
chapters.

Courses 1–14 are category A without exception. **Course 15 `capstone` is the one deliberate
category-B course** — it BUILDS a pipeline instead of explaining a mechanism — and it is here because
it was ported in from the `apache-spark` repo on 2026-09-24 rather than authored to this plan. It sits
last for that reason. Do not read it as licence to add "how to use it" courses: see
`COURSE-PLAN.md` §"The capstone port" before touching it.

**Status (2026-09-24): all 15 courses authored — 162 of 162 sections.**

| # | Course | § | # | Course | § |
|---|---|---|---|---|---|
| 1 | `origins` | 8 | 8 | `pyspark-boundary` | 11 |
| 2 | `topology` | 10 | 9 | `joins` | 11 |
| 3 | `rdd` | 10 | 10 | `formats` | 11 |
| 4 | `execution` | 11 | 11 | `memory` | 11 |
| 5 | `shuffle` | 10 | 12 | `aqe` | 10 |
| 6 | `catalyst` | 12 | 13 | `streaming` | 12 |
| 7 | `tungsten` | 10 | 14 | `lakehouse` | 12 |
|   |  |  | 15 | `capstone` | 13 |

Every section has a scene, a slide and a narration script, and **every frame has been rendered and
looked at**. Guards green throughout.

**45 narration wavs, of 162** — the Colab + Chatterbox step is under way and is the owner's to run.
Courses fully voiced: `origins` 8/8, `topology` 10/10, `rdd` 10/10, `execution` 11/11. In progress:
`shuffle` 1/10. And `capstone` 5/13 — those five (`read-lake`, `partitioned-write`, `enrich`,
`real-time-view`, `serving`) were carried over with the port rather than generated, because their
narration survived it byte-for-byte; the other eight were rewritten and need generating like the rest.
`public/audio/<course>/<section>.wav` is the contract, and `scripts/audio-manifest.json` (regenerate
with `npm run gen:audio`) is what the notebook reads.

## The route contract (do not re-decide it per repo)

- Slug is `<courseId>-<sectionId>`, from the shell's `slugOf`. Routes are `#/<slug>`, capture is
  `?capture=1`, the recorder drives `window.__scene.plan()`.
- `src/content/index.ts` exports `SPINE` — **the fifteen course ids, frozen.** An id may never be
  renamed or reordered once its course is authored, because the slug is the contract. Fourteen were
  declared at the outset; `capstone` was APPENDED on 2026-09-24, which is safe only because nothing
  ahead of it moved. Appending is the only permitted change to this list.
- `SPINE` is the **catalog** ordering, not a dependency chain. Every course is a standalone video, so
  **no course may assume another has been watched**, and narration must never cross-reference a
  module by number ("recall module four") — `data-warehousing` froze its course order by doing that.
  Re-explain the prerequisite in two sentences instead. This is what makes the build order safe:

      5 shuffle → 9 joins → 8 pyspark-boundary → 12 aqe → 10 formats, then 6, 4, 11.

## Scene inventory

`src/scenes/<course>/` — 161 scenes for 162 sections, registered in `src/scenes/index.ts`. Ids are
globally unique, and a scene is content-agnostic by design, so one may be shared across sections:
`capstone` is the only course that does, its two bookends (§1, §13) both riding `cap-lambda-arch`.

Most are node/edge diagrams. The exceptions worth knowing: **code cards** (`kind: 'code'`) carry
§6 of `shuffle`, §11 of `joins`, §11 of `execution`, §12 of `catalyst`, §8 of `tungsten`, §9 of
`pyspark-boundary`, §10 of `aqe` — and **eleven of `capstone`'s thirteen**, which makes that course
the repo's densest concentration of them by far; **tables** (`kind: 'table'`) carry comparisons in
`shuffle`, `joins`, `memory`, `streaming` and `lakehouse`.

### Both diagram classes COURSE-PLAN.md flagged as unproven are now settled

The engine renders a parent with `children` as a **box containing them**, so a tree comes out as
nesting rather than edges. Verified on rendered frames:

- **Expression tree** (`catalyst` §2) — works, and arguably better than edges: the containment *is*
  the precedence. But each operator becomes a group **header**, so a bare `-` is unreadable at
  capture size and needs its name beside it.
- **Paired-process nesting** (`pyspark-boundary` §§1, 4) — works well. An executor box holding a JVM
  child and a Python child reads immediately as *"these two are on the same machine"*. Colour does
  the rest: the JVM `network`, the Python worker `warn`.

### Layout rules — measured off rendered frames, not guessed

**`ui-flow` computes every position and size, but a LEAF card is laid out at a fixed width and does
NOT grow to fit its text.** Overflowing text renders outside the border, on top of whatever is
below. `tsc` and `vite build` both pass on that — it is only visible on the frame.

`npm run check` runs **`scripts/lint-scenes.mjs`**, which enforces the measured limits:

| | limit | why |
|---|---|---|
| leaf `label` | 28 chars | wraps past the card's top border |
| leaf `sub` | 66 chars | spills out of the bottom border |
| unbreakable token in a leaf label | 22 chars | a config key cannot wrap at all |
| group `label` / `sub` | 70 / 120 | the group header is full-width |
| edge `label` | 40 chars | rides the edge midpoint; longer lands on a node |
| code line | 76 cols | a longer line widens the card and shrinks the whole scene |

Two more, which the linter cannot check:

- **An inner group whose children are chained by edges stacks along the SCENE's flow.** Give it its
  own `flow: 'LR'` when the chain should read across, or the scene becomes a tall narrow ribbon and
  the type shrinks to fit it.
- **`variant: 'tile'`** renders a large icon with small text under it. Use it for things being
  *counted* (tasks, partitions), never for things being *read*.

### The two diagram classes still unproven

Neither is needed by the courses authored so far:

- an **expression tree** (operator nodes, literal leaves) — course 6 `catalyst` §02
- **paired-process nesting** (an executor box holding a JVM child and a Python child) — course 8
  `pyspark-boundary` §04. This one is next, so prove it in the `ui-flow` fixture harness first.

## Per-repo surface

`src/main.tsx` mounts `<ConceptApp>` from `@graphlearning/shell` with `subject`, `courses`,
`getScene` and `audioBase`. `src/theme.css` carries the only three design tokens this repo owns —
Apache Spark's orange and gold, **deliberately not** the Databricks excerpt's teal-and-orange; see
`COURSE-PLAN.md` Appendix §8 before changing them.

`@graphlearning/flow` and `@graphlearning/shell` are consumed **as published packages**, pinned by
version. `file:../ui-flow` is for local work only and must never be committed — CI has no sibling
checkout.

## Authoring rules specific to this repo

From `COURSE-PLAN.md`'s Appendix, repeated because they are the ones that get forgotten:

1. **Never narrate from the excerpt PDF's wording** — it is a pre-release draft of chapters the full
   SDG already covers, and still carries typos the published book fixed. Text from the full SDG; the
   excerpt is the *figure* authority only.
2. **Nothing in the folder is current.** Newest primary source is Spark 2.2; the excerpt mentions
   Tungsten, adaptive execution and AQE zero times. Re-ground every tuning, deployment or API claim
   against current docs before it reaches a `.tts`.
3. **Learning Spark 1E is a mechanism source only** — eleven years old, and its streaming chapter is
   DStreams.
4. **Original words, original diagrams.** The excerpt decides *what* to draw, never *how*.

## Verification bar

`npm run build` + `npm run check` (`tsc --noEmit` **and** the scene linter) clean, **and every new
section looked at as a rendered frame** before it is called done.

The Chrome extension is not connected in this environment, so the frame step runs through puppeteer
(already a devDependency) instead: a throwaway script drives `#/<slug>` for each section at
1920×1080, screenshots it, collects console/page errors, and — the part worth keeping — measures
`.slide-panel` `scrollHeight` against `clientHeight`, which catches slide text clipped off the
bottom exactly rather than by eye. Every frame still gets looked at; the script only finds the
defects worth looking for.

**Both guards passed on a scaffold that white-screened, and on frames with text rendering outside
its card.** That is the whole reason the frame step is not optional.
