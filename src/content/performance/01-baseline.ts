import type { Section } from '../types'

export const baseline: Section = {
  id: 'baseline',
  title: 'Establish correct results, representative data and a baseline',
  scene: 'baseline-measure',
  focus: 'baseline-table',
  slide: `## Correct results, then a baseline

**Objective:** compare performance changes with evidence you would trust from someone else.

### Before measuring anything
- A **checksum** that must not change: rows, order count, sales total
- **Representative** data: here 10,000,000 orders, the shape of production
- Stated conditions: \`local[4]\`, 4 cores, Spark 4.0.1

### Worked: the daily summary
- First run **3.86 s**: JVM start-up, file listing, code generation
- Warm runs 1.26, 1.07, 1.21 → median **1.21 s**
- Warm runs varied by ±8% — differences smaller than that are noise

### The misconception
"One run is a measurement." The cold run took **3× longer** than the warm ones.`,
  narration:
    "This chapter is about making a Spark job faster without fooling yourself, and that starts before any tuning. First, correctness. Every change in this chapter is checked against a checksum, here the number of result rows, the order count and the sales total, and a change that alters any of them is not an optimisation. It is a bug. Second, data that looks like production. Every measurement here uses ten million generated orders, enough that the costs we care about actually show up. Third, stated conditions: Spark four point zero point one, in local mode with four cores on a single machine. Now the baseline, the daily summary query from earlier chapters. The very first run took three point eight six seconds. The next three took one point two six, one point zero seven and one point two one, so the median is one point two one. Why was the first run three times slower? The JVM was warming up, the file listing was being built, and query code was being generated and compiled for the first time. None of that repeats on later runs. So the method used throughout this chapter is simple. Run once to warm up and throw the result away. Then run several times and compare medians, never single runs. And notice the spread. The warm runs moved by about eight percent, so any difference smaller than that is noise, not a result.",
}
