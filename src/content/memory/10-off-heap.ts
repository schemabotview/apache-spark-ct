import type { Section } from '../types'

export const offHeap: Section = {
  id: 'off-heap',
  title: 'Off-heap, and why it is not a free win',
  scene: 'mem-off-heap',
  focus: 'cost',
  slide: `## Off-heap

\`\`\`
spark.memory.offHeap.enabled = true
spark.memory.offHeap.size = 8g
\`\`\`

Spark allocates directly through \`Unsafe\`, outside the JVM heap. **The GC never traces it**, so it adds nothing to pause time however large it gets.

Note: that size is a **second budget**, not a share of the first.

### And what it costs you
| | |
|---|---|
| **Two pools to size** | plenty of one, none of the other — a new way to fail |
| **It counts in the container** | raise \`memoryOverhead\` too, or be **OOMKilled** |
| **Leaks are yours** | you opted out of the collector |

### So: only when GC is the *measured* problem
Look at **GC Time** as a fraction of task time in the Executors tab. If it's a few percent, off-heap changes nothing worth having. If it's a third, it's worth trying — and worth measuring before and after.

> A tuning option, not a default. It gets recommended far more casually than it deserves.`,
  narration:
    "Off-heap memory gets recommended more casually than it deserves, so let's be precise about what it buys and what it costs. When you enable it, Spark allocates memory directly through the Unsafe API, outside the JVM heap, and manages it explicitly — allocate, use, free. The garbage collector never traces that memory, so it contributes nothing to pause times no matter how large it grows. For a job where GC pauses genuinely dominate, that's a real and substantial win. One detail people get wrong: the off-heap size you configure is a second budget, not a share of the first. You're not moving memory out of the heap; you're adding a new pool alongside it. Which means your total footprint goes up, and that leads directly to the costs. Three of them. First, you now have two numbers to size instead of one, and you can fail in a new way — plenty of heap and no off-heap, or the reverse. Second, and this one catches people on Kubernetes: off-heap memory counts toward the container's limit. If you enable it without raising memoryOverhead, the kernel OOM-kills your executor and you get exit one-three-seven with no Java error at all. Third, memory management errors become yours. So the rule is: only turn this on when GC is the measured problem, not the suspected one. Go to the Executors tab and look at GC Time as a fraction of total task time. If it's a few percent, off-heap will change nothing you care about. If it's a third, it's worth trying — and worth measuring carefully before and after, because the interaction with container limits means it can easily make things worse.",
}
