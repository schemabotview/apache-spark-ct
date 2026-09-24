import type { Section } from '../types'

export const offHeap: Section = {
  id: 'off-heap',
  title: 'Off-heap: memory Spark manages itself',
  scene: 'tun-off-heap',
  focus: 'honest',
  slide: `## Off-heap

### On-heap Tungsten
Rows live in \`byte[]\` arrays the JVM owns. Far fewer objects than before — but the arrays are still objects, so the GC still considers them.

### Off-heap
Memory allocated **outside the JVM heap**, through \`Unsafe\`. Spark allocates and frees it explicitly, like C.

\`\`\`
spark.memory.offHeap.enabled = true
spark.memory.offHeap.size = 8g
\`\`\`

The garbage collector **never sees it at all.**

### And it is not a free win
- You now size **two** pools by hand — heap *and* off-heap — and getting it wrong means an OOM from a new direction
- A leak is **yours**, not the JVM's
- On Kubernetes it counts toward the container limit, so \`memoryOverhead\` has to grow too

> Real, and worth measuring before enabling. It's a tuning option, not a default.`,
  narration:
    "There's a further step available, and it's worth knowing what it does and doesn't buy. Even with Tungsten's binary format, rows normally live inside byte arrays that the JVM owns. That's already an enormous improvement — a million rows might be a handful of large arrays instead of a hundred million small objects — but those arrays are still objects, and the collector still has to consider them. Off-heap goes further. Spark allocates memory outside the JVM heap entirely, using the Unsafe API, and manages it explicitly: allocate, use, free, much like C. The garbage collector never sees that memory at all, so it contributes nothing to pause times no matter how large it gets. You enable it with two settings: off-heap enabled, and an explicit off-heap size. Now let me be honest about the trade, because this gets recommended more casually than it should be. First, you're now sizing two pools by hand rather than one. Get the split wrong and you get out-of-memory errors from a new direction — plenty of heap, no off-heap, or the reverse. Second, memory management errors become yours. The JVM's collector is imperfect but it's also very good, and you've just opted out of it. Third, on Kubernetes, off-heap memory counts toward the container's memory limit, so if you enable it without increasing memoryOverhead, the kernel OOM-kills your executor and Spark never sees a Java error at all. It's a real tuning option with real gains for GC-bound workloads. It is not a default, and it's worth measuring before and after rather than assuming.",
}
