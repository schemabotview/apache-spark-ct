# apache-spark-ct

Content repo for the **Apache Spark** presentation track, consumed by the
[`graphl-ui`](../graphl-ui) application. Holds scenes, slides, TTS narration
scripts, and pre-rendered audio. No application code lives here.

## Layout

```
apache-spark-ct/
├── manifest.json   # the content the UI fetches (scenes + presentations)
└── audio/          # pre-rendered narration audio (referenced by manifest)
```

## manifest.json schema

```jsonc
{
  "scenes": {
    "<sceneId>": {
      "id": "<sceneId>",
      "title": "…",
      "defaultViewport": { "x": 0, "y": 0, "zoom": 1 },   // optional
      "nodes": [ /* React Flow nodes */ ],
      "edges": [ /* React Flow edges */ ]
    }
  },
  "presentations": [
    {
      "id": "spark-intro",
      "title": "…",
      "topic": "apache-spark",
      "pages": [
        {
          "id": "…",
          "sceneId": "<sceneId>",          // references a scene above (reusable!)
          "slide": {
            "title": "…",
            "bullets": ["…"],
            "code": { "language": "scala", "source": "…" }  // optional
          },
          "overrides": {                    // optional per-page scene tweaks
            "highlightNodeIds": ["driver"]
          },
          "narration": {                    // optional
            "text": "TTS script…",
            "audioSrc": "audio/page-1.mp3"  // relative to this repo's root
          }
        }
      ]
    }
  ]
}
```

**Scene reuse** is the whole point: multiple pages reference the same `sceneId`
and differentiate themselves with `slide` content and `overrides` (highlights,
visible subset, viewport) — the scene is never duplicated.

## Serving locally (for dev)

```sh
npx serve -l 5174 .
```

`graphl-ui` proxies `/content` → `http://localhost:5174` in dev, so set its
`VITE_CONTENT_BASE_URL=/content` (already the default in `.env.development.local`).
