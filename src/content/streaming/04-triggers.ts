import type { Section } from '../types'

export const triggers: Section = {
  id: 'triggers',
  title: 'Triggers and processing cadence: execution modes and their constraints',
  scene: 'trigger-modes',
  focus: 'trigger-table',
  slide: `## Triggers and cadence

**Objective:** choose when micro-batches run, and know what each choice gives up.

### Four execution modes
- **Default:** next batch as soon as the last ends
- **processingTime:** fixed interval; an overrun is followed at once, never overlapped
- **availableNow:** everything available now, then **stop** — runs no-data batches to close windows
- **continuous:** experimental, ~1 ms; map-like only — no aggregations, no \`foreachBatch\`

**Retail stream:** hourly summary with \`availableNow\` on a scheduler; dashboard feed every 2 seconds.

### The misconception
"A one-hour trigger makes it a batch job." It still keeps state and a checkpoint, and resumes where it stopped.`,
  narration:
    "The trigger decides when micro-batches run. There are four choices. With no trigger set, the default, Spark starts the next micro-batch as soon as the previous one finishes, so latency is roughly one batch duration. A processing time trigger runs batches on a fixed interval, say every two seconds. If a batch takes longer than the interval, the next one starts immediately when it ends; batches never overlap. The available now trigger processes everything that is available when the query starts, possibly in several batches, and then stops. That suits a scheduled job: run it every hour, let it catch up, release the cluster. It still respects source rate limits, and at the end it runs a batch with no data so that the watermark can advance and windows can close. Finally, the continuous trigger is experimental. It keeps long-running tasks open and can reach latencies around a millisecond, but only for map-like queries: selections, projections and filters. Aggregations are not supported, and neither is for each batch. For the retail pipeline, an hourly summary would use available now on a scheduler, while a live dashboard feed would use a two second processing time trigger. The misconception to avoid is that a long trigger interval turns a stream into a batch job. It does not. The query still keeps its state and its checkpoint between runs, and it picks up exactly where it stopped, which a batch job reading the whole input would not.",
}
