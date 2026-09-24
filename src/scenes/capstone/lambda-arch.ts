import type { Scene } from '@graphlearning/flow'

// cap-lambda-arch — the master map of course 15 (capstone), carried by the two bookends (§1 the-plan
// and §13 closer). It shows the whole Lambda pipeline the project builds: one clickstream, fed into
// two layers, merged for serving, and run on a cluster — a single spine:
//
//        Sources (Data Lake · Kafka)
//        Two layers ┬── Batch layer (nightly, accurate):  read ▸ clean ▸ aggregate ▸ view
//                   └── Speed layer (streaming, fresh):   readStream ▸ enrich ▸ window ▸ view
//              Serving layer (merge history + recent → one answer)
//
// A fourth row — "Run it: spark-submit · on a cluster · observe + tune" — was in this scene when it
// came over from the `apache-spark` repo, and was DROPPED here. With it the scene rendered at 12.9pt
// on a 1920×1080 frame, under this repo's 13pt floor; without it, 13.7pt. `scripts/frames.mjs` is
// what caught that, and the repo it came from had no such check. Removing the `sources` row instead
// scored identically, so the choice was editorial: `sources` states the premise the whole Lambda
// split rests on (one clickstream, two entry points), whereas the run row restated §11 deploy and
// §12 tune, both of which carry their own code card. Note that leaf cards are FIXED height — trimming
// the `sub` strings first changed the type size by exactly nothing. Only node count moves it.
//
// Composition, and why it is folded this way: each lane runs LR and the two lanes STACK inside a
// `lanes` wrapper. Drawn as two TB lanes side by side the scene measured 746×1508 — a 0.49 aspect in
// a roughly square pane, so fitView was height-bound at 0.65 and the right half of the pane sat
// empty. Folded this way it is ~1166×1192 (0.98), essentially the pane's own aspect, and scales to
// ~0.85. This is the CLAUDE.md rule about an inner group whose children are chained by edges: both
// lanes need their own `flow: 'LR'` or the scene becomes a tall narrow ribbon.
//
// The cost of folding is the branch → merge diamond: with the lanes stacked, a `batch → serving` edge
// would route straight through the speed lane's box, because layout remaps the endpoint to `lanes`
// but the ARROW keeps its real deep endpoint. So the spine addresses the wrapper. The parallelism
// still reads from the two lane boxes sitting side by side inside one wrapper, and every intra-lane
// arrow survives — those are what each build section actually walks.
//
// The 11 build sections do NOT reuse this map: each carries its own code card, and this scene is the
// orientation device the course opens and closes on. Node ids: `src-*`, `ba-*` batch, `sp-*` speed,
// `sv-*` serving, `run-*` deploy.
export const lambdaArch: Scene = {
  id: 'cap-lambda-arch',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'sources',
      label: 'Sources — one event stream, two entry points',
      pattern: 'group',
      sub: 'the clickstream',
      cols: 2,
      children: [
        { id: 'src-lake', label: 'Data Lake', pattern: 'storage', icon: 'database', sub: 'raw events as Parquet · feeds batch' },
        { id: 'src-kafka', label: 'Kafka', pattern: 'external', icon: 'waves', sub: 'real-time events · feeds speed' },
      ],
    },
    {
      id: 'lanes',
      label: 'Two layers — one clickstream, two speeds',
      pattern: 'group',
      sub: 'the Lambda split',
      // No edges between the lanes — an edgeless container STACKS its children, which is what folds
      // the two LR lanes into a near-square block instead of a 2320px-wide row.
      children: [
        {
          id: 'batch',
          label: 'Batch layer — nightly · accurate',
          pattern: 'service',
          icon: 'database',
          sub: 'the source of truth',
          flow: 'LR',
          children: [
            { id: 'ba-read', label: 'read the lake', pattern: 'service', icon: 'database', sub: 'Parquet · pushdown' },
            { id: 'ba-clean', label: 'clean + dedup', pattern: 'service', icon: 'wrench', sub: 'filter · withColumn' },
            { id: 'ba-agg', label: 'join + aggregate', pattern: 'service', icon: 'gears', sub: 'sort-merge · groupBy' },
            { id: 'ba-view', label: 'batch view', pattern: 'service', icon: 'layers', sub: 'partitioned write' },
          ],
          edges: [
            { source: 'ba-read', target: 'ba-clean' },
            { source: 'ba-clean', target: 'ba-agg' },
            { source: 'ba-agg', target: 'ba-view' },
          ],
        },
        {
          id: 'speed',
          label: 'Speed layer — streaming · low latency',
          pattern: 'service',
          icon: 'waves',
          sub: "what's happening now",
          flow: 'LR',
          children: [
            { id: 'sp-read', label: 'readStream', pattern: 'service', icon: 'waves', sub: 'from Kafka' },
            { id: 'sp-enrich', label: 'enrich', pattern: 'service', icon: 'share', sub: 'broadcast-join product dim' },
            { id: 'sp-window', label: 'window + watermark', pattern: 'service', icon: 'clock', sub: 'revenue per 5-min · per category' },
            { id: 'sp-view', label: 'real-time view', pattern: 'service', icon: 'layers', sub: 'writeStream + checkpoint' },
          ],
          edges: [
            { source: 'sp-read', target: 'sp-enrich' },
            { source: 'sp-enrich', target: 'sp-window' },
            { source: 'sp-window', target: 'sp-view' },
          ],
        },
      ],
    },
    {
      id: 'serving',
      label: 'Serving layer — merge the two views',
      pattern: 'user',
      icon: 'share',
      sub: 'accuracy from batch · latency from speed',
      flow: 'LR',
      children: [
        { id: 'sv-merge', label: 'merge', pattern: 'user', icon: 'share', sub: 'batch history + recent stream' },
        { id: 'sv-answer', label: 'the answer', pattern: 'service', icon: 'gauge', sub: 'revenue by category, up to now' },
      ],
      edges: [{ source: 'sv-merge', target: 'sv-answer' }],
    },
  ],
  edges: [
    { source: 'sources', target: 'lanes' },
    { source: 'lanes', target: 'serving' },
  ],
}
