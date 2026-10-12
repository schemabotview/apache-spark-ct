import type { Section } from '../types'

export const workedComparison: Section = {
  id: 'worked-comparison',
  title: 'Worked comparison: before/after evidence and measurement limits',
  scene: 'before-after',
  focus: 'steps-table',
  slide: `## Worked comparison: one change at a time

### The evidence, sales by city and day
1. **Before:** four mistakes — **10.98 s**, 4,065 tasks
2. **Allow broadcast:** shuffle 65 → 7.5 MB — **5.54 s**
3. **AQE on:** 2,065 tasks become 68 — **2.95 s**
4. **Compact to 32 files:** 7 tasks — **0.98 s**

Checksum unchanged at every step: **1,500 rows, 8,000,464 orders, 368,061,489.09**

### Measurement limits
- One machine: no network, so **shuffles cost less** here than on a cluster
- Files stayed in the OS cache between runs
- "Before" runs ranged **9.82–13.76 s**: report the spread too

### The misconception
"It got 11× faster, so it will on the cluster." The **ranking** of fixes transfers; the ratios need re-measuring there.`,
  narration:
    "Let's finish with a full before and after comparison, done the way this chapter recommends: one change at a time, each measured five times, with the checksum checked at every step. The query computes sales by city and day. The starting point combines several mistakes: two thousand small files, adaptive execution off, two thousand shuffle partitions, and broadcasting disabled. Its median was eleven seconds, across more than four thousand tasks. Allowing the store table to be broadcast removed most of the shuffle, sixty five megabytes down to seven and a half, and halved the time to five and a half seconds. Turning adaptive execution on coalesced two thousand tiny shuffle tasks into three, and took us under three seconds. Compacting the input into thirty two files removed sixty read tasks and their overhead, and the query finished in just under one second. At every step the result was identical: fifteen hundred rows, eight million and four hundred and sixty four orders, and the same sales total. Now be honest about the limits. This ran on one machine, with no network, so shuffles were cheaper here than they would be on a cluster. After the first run, the files sat in the operating system's cache. And the starting runs varied from under ten seconds to almost fourteen, which is why we report the median and the spread. So the misconception is that an eleven times speedup here means eleven times in production. The ranking of the fixes transfers. The ratios must be measured again where the job really runs. Next, we leave bounded data behind for data that never stops arriving.",
}
