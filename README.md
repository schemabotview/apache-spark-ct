# apache-spark-ct

Content repo for the **Apache Spark** presentation track, consumed by the
[`graphl-ui`](../graphl-ui) application. Holds scenes, slides, TTS narration
scripts, and pre-rendered audio. No application code lives here.

## Layout

```
apache-spark-ct/
├── manifest.json        # lists scene ids + presentations
├── scenes/<id>.json     # one declarative SceneSpec per scene (data, no geometry)
└── audio/               # pre-rendered narration audio (referenced by manifest)
```

Scenes are **declarative data**, not pixel geometry. Each `scenes/<id>.json` is a
`SceneSpec`: nodes are placed on a logical `grid` by `cell` coordinates, and the
UI runs the layout algorithm (`graphl-ui/src/scene/grid.ts`) to resolve cells →
pixel boxes at render time. No positions are ever hand-authored here.

## manifest.json schema

`scenes` is a list of scene ids; the UI loads each from `scenes/<id>.json`.

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
