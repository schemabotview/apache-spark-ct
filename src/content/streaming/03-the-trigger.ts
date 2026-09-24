import type { Section } from '../types'

export const theTrigger: Section = {
  id: 'the-trigger',
  title: 'The trigger: when a batch runs',
  scene: 'str-trigger',
  focus: 'table',
  slide: `## The trigger

Decides **when** a batch runs. Nothing else changes — same query, same output, different rhythm.

| Trigger | What it does |
|---|---|
| **default** | a new micro-batch as soon as the last finishes |
| **\`processingTime("1 minute")\`** | one batch a minute, on the clock |
| **\`availableNow\`** | process everything waiting, then **stop** |
| **continuous** *(experimental)* | record at a time, ~1 ms — map-like ops only |

### \`availableNow\` is the one people miss
A **batch** job with a **streaming** job's bookkeeping. It picks up where the last run stopped, processes what's arrived, and exits.

So a nightly job doesn't need a "which files did I do last time?" table — the checkpoint already knows.

> \`processingTime\` is a *minimum*, not a schedule. If a batch takes 90 s on a 60 s trigger, the next starts immediately and you're falling behind — which is the first thing to check when latency creeps.`,
  narration:
    "The trigger decides when a micro-batch runs. It doesn't change the query, the semantics, or the output — just the rhythm. The default trigger starts a new batch as soon as the previous one finishes. That gives you the lowest latency available, and it means batch sizes vary with however much data turned up. Processing-time with an interval runs one batch on a fixed clock — every minute, say. That gives you predictability, which matters if downstream systems expect a rhythm. AvailableNow processes everything currently waiting and then stops. And this one deserves attention because people miss it. It's a batch job with a streaming job's bookkeeping. It picks up exactly where the last run stopped, processes whatever has arrived since, writes the results, and exits. Which means a nightly job doesn't need its own table tracking which files it processed last time — the checkpoint already knows. You get incremental batch processing with no bookkeeping code of your own. And continuous processing is an experimental mode that runs record-at-a-time for around a millisecond of latency, rather than micro-batches. It supports only map-like operations — no aggregations, no joins — so it's rarely the answer. One thing worth knowing about processing-time triggers: the interval is a minimum, not a schedule. If you set a sixty-second trigger and a batch takes ninety seconds, Spark doesn't run two at once. The next one starts immediately, and you're now permanently behind and falling further. That's the first thing to check when a streaming job's latency starts creeping up.",
}
