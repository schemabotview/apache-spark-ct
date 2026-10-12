import type { Section } from '../types'

export const dataSkew: Section = {
  id: 'data-skew',
  title: 'Detect and mitigate data skew',
  scene: 'skew-detect',
  focus: 'skew-table',
  slide: `## Detecting and mitigating skew

### Detect
- One key, store 7, holds **5,099,631** of 10,000,000 rows (51%)
- Join-stage tasks: median **901 ms**, max **1,895 ms** — the max is the tell

### Mitigate, measured
- AQE skew join at its **256MB** default: not triggered on this data — 3.18 s
- Threshold lowered to **8MB**: partition split into 9 tasks, max 624 ms — **2.24 s**
- **Broadcast** the small side: no skewed shuffle at all — **1.04 s**
- **Salting ×8**: 3.67 s — still a 1.9 s task across only 5

### The misconception
"Salting fixes skew." Here it was the **slowest** option; removing the shuffle was the fix.`,
  narration:
    "Skew is when one key carries far more data than the rest, so the task that owns it runs long while the others sit idle. To measure it, we made a copy of the orders in which store seven holds half of all rows, five point one million of ten million, and joined it to the store table with broadcasting switched off. Detect it in the task times. The join stage's median task took nine hundred milliseconds, but its slowest took almost nineteen hundred. That long maximum is the signature of skew. Then we tried the standard mitigations and measured each one. Adaptive execution has skew join handling, on by default, but it only acts on a partition larger than both five times the median and two hundred and fifty six megabytes. Our skewed partition never reached that, so nothing changed. Lowering the threshold to eight megabytes made adaptive execution split the skewed partition into several tasks. The slowest task fell to six hundred and twenty four milliseconds, and the query to two point two four seconds. Broadcasting the small store table removed the skewed shuffle altogether, and took just over one second. Finally, salting, which adds a random key to spread the hot store across eight partitions. It was the slowest option, three point six seven seconds, and still had a nineteen hundred millisecond task. The misconception is that salting always fixes skew. Here, the real fix was removing the shuffle.",
}
