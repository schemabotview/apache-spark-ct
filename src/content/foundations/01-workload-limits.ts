import type { Section } from '../types'

export const workloadLimits: Section = {
  id: 'workload-limits',
  title: 'When one machine is enough',
  scene: 'local-daily-summary',
  focus: 'one-machine-limits',
  slide: `## When one machine is enough

**Objective:** decide whether a workload really needs distributed processing — before reaching for Spark.

### The retail workload
- About **200 GB** of order events arrive each day
- A year of history comes to roughly **70 TB**
- The daily sales summary is due **before stores open**

### Distribute only when
- The data outgrows **one machine's memory or disk**
- One full scan takes longer than the **deadline** allows
- The work splits into **independent pieces**`,
  narration:
    "Before learning how Spark works, it is worth asking when you need it at all, because the honest answer is less often than people assume. The code on the left is plain pandas. It reads one day of a retailer's order events, keeps the completed orders, and sums the sales for each store. On a sample, this is exactly the right tool. It is short, it is easy to test, and nothing has to cross a network. Now apply the retailer's real numbers. About two hundred gigabytes of events arrive every day, and a year of history comes to roughly seventy terabytes. Pandas holds its whole input in the memory of a single process, so the first limit is memory. The second is scan time, because one disk still has to read every byte. The third is the deadline, since the summary must be ready before the stores open. And the fourth is fragility: a crash near the end means starting again from the beginning. Distributed processing is justified when one of those limits is genuinely reached, and the work can be split into pieces that run independently. If a single machine meets the deadline, keep the single machine.",
}
