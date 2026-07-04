# CLAUDE.md — apache-spark-ct

A **content repo**, not an app. It holds the **Apache Spark** concept, authored **video-first** for the `graphl-movie` app (sibling repo), which loads it **at runtime**. No render engine and no scenes live here — the app fetches this repo's `manifest.json` + notebooks + slides over the network and renders/records them. Read alongside the workspace map in `../CLAUDE.md`, the app contract in `../graphl-movie/CLAUDE.md`, and the two references: the graphl-ux-era `../apache-spark-content/` (prior Spark curriculum, tts + audio already voiced) and the sibling `-ct` template `../databricks-data-engineer-ct/`.

This is a video-target (`-ct`) content repo. It is authored **fresh** — the existing `../apache-spark-content` (the graphl-ux-era repo) and `~/Projects/apache-spark` (the source curriculum) are **reference material**, not something to copy wholesale. We are **re-authoring the spine to ~10 modules × ~10 sections** (the graphl-ux-era Spark repo ran 9 modules of 12–21 sections); we refine structure, not port it.

Concretely, each module's section notebooks are **split from the reference per-module notebook** (`apache-spark-content/notebooks/NN-*.ipynb`, itself from `~/Projects/apache-spark`) — the source of truth for the split — then refined for the video target (trimmed to the agreed spine, `## `-per-section, images dropped). **Narration is re-authored fresh** — every section gets a newly written `.tts` (do **not** reuse the old `../apache-spark-content` `.wav`s, even where a heading survives; the old repo is prose reference only). **The owner generates the `.wav`s via Colab** (`scripts/colab_generate_audio.ipynb`); authoring never copies or commits audio.

There is **nothing to build, run, or test** here. The one executable (later) is the Colab tool that turns `tts/` scripts into `audio/` `.wav`s (`scripts/colab_generate_audio.ipynb`).

## Working agreement

Same as the app repo: **step by step, one small slice, review gate between each.** We settle the shape first (module spine → per-module sections → …), then fill content deliberately. No batch generation.

## The core contract (from graphl-movie — do not break)

1. **The notebook is the single source of truth** for a section's prose and code. `manifest.json` only *wires* — it must never duplicate notebook content.
2. **One notebook per section** (not per module): each `.ipynb` holds exactly one `## ` section. The section is the atomic unit across all four artifacts — `.ipynb` + `.tts` + `.slide` + `.wav` share the same `NN-SS-slug` stem — so a section can be authored and reviewed on its own. The manifest references each artifact by path; the notebook's single `## ` heading is the section title (mirror it in the manifest `heading`).
3. Each section is the unit the video steps through and has its own **`.ipynb`** (prose/code), **`.tts`** (narration script), **`.wav`** (generated audio), and — new for video — a **`.slide`** file (the authored right-pane: title + concise bullets). Module title/lede lives in `README.md` + the manifest, not in the section notebooks.
4. A section's diagram images (`![]()`) are **stripped** by the app — the React Flow **scene** replaces them.
5. **Scenes live in the `graphl-movie` app** (`src/scenes/*`), authored with the engine's pattern helpers, ported from `graphl-ux/src/scenes/spark*.ts`. Here you only reference a scene **by id**, plus `highlight` (node ids that get the spotlight) and `focus` (a node id the camera frames) per section.

## Folder layout

```
apache-spark-ct/
  notebooks/   # one .ipynb per SECTION (one ## section each) — source of truth for prose/code
  tts/         # one .tts per section (plain spoken narration script)
  audio/       # one .wav per section (generated from tts/ via Colab)
  slides/      # one .slide per section (authored right-pane title + bullets)
  manifest.json  # wires sections → notebook / slide / scene / highlight / focus / audio
  CLAUDE.md · README.md
```

Naming: every artifact for a section shares the stem `<NN>-<SS>-<slug>`, where `NN` = module number, `SS` = section position (so a sorted glob stays in reading order): `notebooks/<NN>-<SS>-<slug>.ipynb`, `tts/…​.tts` → `audio/…​.wav`, `slides/…​.slide`.

The `.slide` format is a one-screen, scannable Markdown subset — a `# Title`, then `## ` sub-labels, short paragraphs, fenced ` ```code``` ` blocks, and numbered / `- ` lists, each key term marked with inline **`**bold**`** (rendered bright white, the rest a softer gray). **Keep the whole slide inside the fixed 1920×1080 frame:** the app's right pane does not scroll or auto-shrink type, so an over-long slide clips top and bottom — trim it to fit (drop connective prose the narration already carries) rather than expecting the engine to resize. Title may be punchier than the notebook `## ` heading.

## Scenes (app-side, ported from graphl-ux)

The three Spark scenes are ported into `graphl-movie/src/scenes/` from `graphl-ux/src/scenes/`: `spark-architecture` (whole-system execution map), `spark-batch-api` (the shared batch/DataFrame/RDD master map), and `spark-streaming`. Port transforms mirror the databricks port: graphl-movie's `patterns.ts` exports `wgrid` (graphl-ux inlines it); graphl-movie `NodeKind` has no `'label'`/`'code'` so those leaves become `term` chips; graphl-movie has `YELLOW` (storage/format nodes forced to ORANGE in graphl-ux can be restored); `SceneSpec` drops `topic`/`subtitle` + per-edge colors; every seed carries a `cell`. **Keep node ids identical to the source** so `highlight`/`focus` wiring transfers.

## Curriculum

The re-authored course outline (module spine + per-module sections) lives in [`README.md`](./README.md) — the single human-facing source for structure while we plan; `manifest.json` becomes the machine source of truth once authored. Don't duplicate the module/section list here.

**Agreed target:** ~10 modules, each ~10 sections, each authored as one standalone narrated video (one dense scene + a linear section walkthrough). The exam-questions module and the hands-on project are parked (Q&A / open-ended is a weak fit for the narrated-scene format). Per-module section lists get refined in `README.md` module by module.

## Status

Scaffolded (slice 1): dir tree + `.gitignore` + `scripts/colab_generate_audio.ipynb` + this file + `README.md`. Concept wired into the app catalog (`graphl-movie/src/content/catalog.ts` → `apache-spark`). **Not yet pushed to a remote; no sections authored yet.** Next: settle the re-authored module spine in `README.md`, then port `spark-architecture` and author module 01 end-to-end as the vertical proof.
