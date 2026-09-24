import type { Section } from '../types'

export const window: Section = {
  id: 'window',
  title: 'Speed layer · Window + watermark',
  scene: 'cap-window',
  slide: `## Speed · Window + watermark

Aggregate revenue per category in **5-minute event-time windows**, with a **watermark** to bound late data and state.

### What’s happening
- \`withWatermark\` — tolerate **10 min** of lateness, then finalize & drop stragglers
- \`window("ts", "5 min")\` buckets by **event time**, not when the event arrived
- The running totals live in the **state store**, checkpointed for recovery

**Exercises:** event-time windows · watermarks · the state store`,
  narration:
    'The third stage is where the speed layer earns its keep, and where event time stops being a detail and becomes the whole point. We want revenue per category in five-minute buckets — but bucketed by when each purchase actually happened, its event time, not when it happened to reach Spark. Those two clocks come apart constantly in a real system: networks stall, mobile clients go offline and sync later, a queue backs up. So we group by a five-minute window over the ts column, alongside category, and sum the amount — and because the window is defined over the event’s own timestamp, an event stamped at ten-oh-four lands in the ten-o’clock-to-ten-oh-five bucket no matter when it shows up. That immediately raises the problem every streaming aggregation has: if a late event can still change an old window, when is any window ever finished? You cannot keep every window open forever — on a stream that never ends, that is unbounded memory. That’s what withWatermark answers. We tell Spark to tolerate up to ten minutes of lateness, and that single number buys two things at once. Anything later than ten minutes is dropped outright rather than silently mis-counted. And once the watermark advances past a window’s end, that window is final, so Spark can emit it and evict its state — which is the only thing bounding memory here. Those running per-window totals live in the state store between triggers, and — crucially — they’re checkpointed, so if the job restarts, the in-progress windows come back exactly as they were. Two calls, withWatermark and window, buy all of that: correct bucketing by event time, a bound on lateness, and a bound on memory. We’ve got live, windowed revenue; the last speed step writes it out.',
}
