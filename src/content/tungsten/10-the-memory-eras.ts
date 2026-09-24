import type { Section } from '../types'

export const memoryEras: Section = {
  id: 'the-memory-eras',
  title: 'Three memory eras, and why your cache vanished',
  scene: 'tun-memory-eras',
  focus: 'unified',
  slide: `## Three memory eras

### Spark 1.x — two fixed pools, a wall between them
\`storage: 60%\` · \`shuffle: 20%\`, set in advance.

An idle storage pool could not help a starving shuffle. You tuned two numbers by hand and got it wrong.

### Spark 1.6+ — one pool, a soft boundary
\`spark.memory.fraction\` (0.6) is the shared pool. \`storageFraction\` (0.5) is **only the floor storage can defend** — not a reservation.

| | |
|---|---|
| **Execution can evict storage** | down to that floor |
| **Storage cannot evict execution** | spilling mid-shuffle loses work |

That asymmetry is deliberate: evicted cache can be **recomputed** from lineage. Evicted shuffle state is just lost.

### Which is why "my cache disappeared" isn't a bug
A big join legitimately took the memory back. Check **Fraction Cached** in the Storage tab — it's often well under 100%, and nobody told you.`,
  narration:
    "Let's close with memory management, because it explains a behaviour that looks like a bug and isn't. In Spark one-point-x, executor memory was divided into two fixed pools. A storage fraction for cached data, defaulting to sixty percent, and a shuffle fraction for joins and sorts, defaulting to twenty. Fixed, in advance, by configuration. The problem is obvious in hindsight: if your job caches nothing, sixty percent of your memory sits idle while your shuffle spills to disk for want of it. You tuned two numbers by hand, for every job, and you usually got it wrong. Spark one-point-six introduced the unified memory manager, and it's what you're running today. There's now one shared pool — spark dot memory dot fraction, sixty percent by default — and the boundary inside it is soft. Execution and storage borrow from each other as needed. There's a second setting, storageFraction, and the crucial thing is that it is not a reservation. It's only the floor that storage is allowed to defend. And the borrowing is deliberately asymmetric. Execution can evict cached data, down to that floor. Storage cannot evict execution. The reason is elegant: if cached data is evicted, lineage can recompute it — you lose time, not correctness. If shuffle state were evicted mid-operation, that work is simply gone. So Spark protects the thing that can't be rebuilt. And that asymmetry is exactly why people report that their cache mysteriously disappeared. It didn't disappear — a large join legitimately took the memory back, as designed. The place to check is the Fraction Cached column in the Storage tab, which is frequently well under a hundred percent, and nothing warns you.",
}
