import type { Section } from '../types'

export const uiAndMetrics: Section = {
  id: 'ui-and-metrics',
  title: 'Use the Spark UI and metrics to locate expensive stages',
  scene: 'stage-metrics',
  focus: 'metrics-table',
  slide: `## Locate the expensive stage

The Spark UI's **Stages** tab and the monitoring **REST API** expose the same per-stage metrics.

### Worked: the baseline query
- Stage 19 used **3,275 ms** of the 3,289 ms of task time — read there first
- It read **34.7 MB** of a 138 MB dataset: column pruning at work
- Task times 679 / 841 / **991 ms**: even, so no skew

### What to read, in order
1. **Task time** per stage — where the work is
2. **Min / median / max** task time — skew shows as a long max
3. **Input, shuffle, spill, GC** — what kind of cost it is

### The misconception
"Task time is wall-clock time." 3,275 ms of task time ran in about **1 s** across 4 cores.`,
  narration:
    "Once you have a baseline, the next question is where the time goes. Do not guess. The Spark UI's stages tab shows it, and the monitoring REST API returns the same numbers as data, which is how every figure in this chapter was collected. Here is the baseline query, broken into its three stages. Stage eighteen read the fifty stores for the broadcast, and took six milliseconds. Stage twenty one combined the shuffled partial results, and took eight. Stage nineteen took three thousand two hundred and seventy five milliseconds of task time, almost all of the query's three thousand two hundred and eighty nine. That is where to look, and nowhere else is worth tuning. The same row tells you more. It read thirty four point seven megabytes from a dataset of one hundred and thirty eight, because only the needed columns were read. Its four tasks took between six hundred and seventy nine and nine hundred and ninety one milliseconds, an even spread, so there is no skew to chase. Read stage metrics in that order: task time to find the work, the minimum, median and maximum task time to spot skew, and then input, shuffle, spill and garbage collection to learn what kind of cost it is. One trap in reading them. Task time is summed across tasks. Three thousand two hundred and seventy five milliseconds of it ran in about one second of wall clock time, because four cores worked in parallel.",
}
