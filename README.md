# apache-spark-ct

Content repo for the **Apache Spark** presentation track, consumed by the
[`graphl-ui`](../graphl-ui) application. Holds scenes, slides, TTS narration
scripts, and pre-rendered audio. No application code lives here.

## Layout

```
apache-spark-ct/
├── manifest.json        # lists scene ids + presentations / modules
├── scenes/<id>.json     # one declarative SceneSpec per scene (data, no geometry)
├── notebooks/<n>.ipynb  # source notebooks (the content of notebook-backed modules)
├── tts/<module>/<s>.tts # per-section narration scripts (TTS input)
├── audio/<module>/<s>.wav  # per-section pre-rendered narration audio
└── scripts/
    ├── sync-notebooks.sh   # refresh notebooks/ from the source repo (../../Projects/apache-spark)
    └── build-modules.py    # regenerate the 8 non-RDD module entries in manifest.json
```

## Modules

The Apache Spark track is **9 notebook-backed modules**, mirroring the 9 source
notebooks (one module = one study session, ~30–60 min):

| # | Module (`id`) | Notebook | Default scene |
|---|---|---|---|
| 1 | `spark-foundations` | `01-spark-foundations-execution-model` | `spark-execution` |
| 2 | `spark-rdd` | `02-rdd-api` | `spark-rdd-api` |
| 3 | `spark-dataframes` | `03-dataframes` | `spark-dataframe-api` |
| 4 | `spark-reading-writing` | `04-reading-writing` | `spark-reading-sources` (+ `spark-writing-sinks`) |
| 5 | `spark-transformations` | `05-data-transformations` | `spark-transformations` |
| 6 | `spark-sql-udfs` | `06-sql-udfs` | `spark-sql-api` |
| 7 | `spark-streaming` | `07-structured-streaming` | `spark-structured-streaming` (+ windowing/watermarking) |
| 8 | `spark-performance` | `08-performance-tuning` | `spark-performance-tuning` (+ `spark-cache-persist`) |
| 9 | `spark-pandas` | `09-pandas-api` | `spark-pandas-api` |

**Regenerating.** Edit content in the source notebooks, then:

```sh
scripts/sync-notebooks.sh     # copy notebooks/ in from ../../Projects/apache-spark
python3 scripts/build-modules.py   # rebuild the 8 non-RDD module overlays in manifest.json
```

`build-modules.py` holds a `CONFIG` of per-section scene/highlight rules and
preserves the hand-tuned `spark-rdd` entry. The UI renders prose + code straight
from the notebook, so most edits need no manifest change.

**Narration/audio status.** Per-section `.tts` scripts exist for `spark-rdd` only;
the other 8 modules and all `.wav` audio are TODO (audio is rendered by the
ChatterboxTTS Colab, then wired via each section's `audio` field).

## Notebook-backed modules

A presentation can be **notebook-backed** instead of hand-authored: the notebook
is the single source of truth for prose + code, and the manifest only *wires*
each `##` section to a scene, highlights, and audio. The UI fetches the notebook,
splits it at each level-2 heading into one page per section, renders markdown
verbatim and code cells as highlighted ```python blocks, then applies the overlay.

```jsonc
{
  "id": "spark-rdd",
  "title": "RDD API — Spark's Low-Level Core",
  "topic": "apache-spark",
  "notebook": "notebooks/02-rdd-api.ipynb",   // <- source of truth
  "defaultScene": "spark-rdd-api",            // scene shared across sections
  "sections": [
    {
      "id": "narrow-wide",
      "heading": "Narrow vs wide transformations",  // matches the notebook ## heading
      "highlightNodeIds": ["rdd-narrow", "rdd-wide"],
      "tts": "tts/spark-rdd/narrow-wide.tts",
      "audio": "audio/spark-rdd/narrow-wide.wav"     // optional; lights up the player
    }
  ]
}
```

Sections are matched to notebook headings loosely (case/backtick/space-insensitive).
A notebook section with no overlay still renders, using `defaultScene`. Run
`scripts/sync-notebooks.sh` to copy the latest notebooks in from the source repo.

Scenes are **declarative data**, not pixel geometry. Each `scenes/<id>.json` is a
`SceneSpec`: nodes are placed on a logical `grid` by `cell` coordinates, and the
UI runs the layout algorithm (`graphl-ui/src/scene/grid.ts`) to resolve cells →
pixel boxes at render time. No positions are ever hand-authored here.

## manifest.json schema

`scenes` is a list of scene ids; the UI loads each from `scenes/<id>.json`.
A presentation is either **notebook-backed** (the norm — see above) or
**hand-authored** with explicit `pages`, shown here:

```jsonc
{
  "scenes": ["spark-execution", "apache-spark-api-stack", "…"],
  "presentations": [
    {
      "id": "spark-execution",
      "title": "…",
      "topic": "apache-spark",
      "pages": [
        {
          "id": "…",
          "sceneId": "spark-execution",     // references a scene file (reusable!)
          "slide": {
            "title": "…",
            "bullets": ["…"],
            "code": { "language": "scala", "source": "…" }  // optional
          },
          "overrides": {                     // optional per-page scene tweaks
            "highlightNodeIds": ["driver"]   // also: visibleNodeIds, viewport
          },
          "narration": {                     // optional
            "text": "TTS script…",
            "audioSrc": "audio/page-1.mp3"   // relative to this repo's root
          }
        }
      ]
    }
  ]
}
```

### scenes/&lt;id&gt;.json schema (SceneSpec)

```jsonc
{
  "id": "spark-execution",
  "topic": "apache-spark",
  "title": "…",
  "subtitle": "…",                              // optional
  "grid": { "cols": 3, "rows": 12, "gap": 0.3, "padding": 0.5 },
  "nodes": [
    {
      "id": "driver",
      "label": "Driver",
      "kind": "symbol",                          // symbol | term | container | group | code
      "color": "orange",                         // palette name or #hex
      "sub": "runs your code",                   // optional caption
      "cell": [1, 0, 1, 1]                       // [col, row, colSpan?, rowSpan?]
    },
    {
      "id": "catalyst", "label": "Catalyst Optimizer", "kind": "container",
      "color": "purple", "cell": [0, 1, 3, 2],
      "layout": { "cols": 4, "rows": 1 },        // children resolved INSIDE this box
      "children": [ /* SceneNodeSpec[] with their own cells */ ]
    }
  ],
  "edges": [ { "from": "driver", "to": "catalyst" } ]   // animated by default
}
```

`container` / `group` nodes nest children in their own sub-grid (containment is
exact). **Scene reuse** is the whole point: multiple pages reference the same
`sceneId` and differentiate with `slide` content and `overrides` (highlights,
visible subset, viewport) — the scene is never duplicated.

> These scene JSONs are generated from the authored `SceneSpec`s in
> `graphl-mobile` (`src/data/scenes/*.ts`) — the layout-pattern helpers
> (`rows`/`columns`/`stack`/`container`) compose the cells; the committed file is
> the resolved data.

## Serving locally (for dev)

```sh
npx serve -l 5174 .
```

`graphl-ui` proxies `/content` → `http://localhost:5174` in dev, so set its
`VITE_CONTENT_BASE_URL=/content` (already the default in `.env.development.local`).
