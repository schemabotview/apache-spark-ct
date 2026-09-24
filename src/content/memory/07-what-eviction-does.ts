import type { Section } from '../types'

export const whatEvictionDoes: Section = {
  id: 'what-eviction-does',
  title: 'What eviction actually does',
  scene: 'mem-eviction',
  focus: 'worst',
  slide: `## What eviction does

**LRU**, and it works on **whole partitions.** A partition is never half-cached — the unit that arrives is the unit that leaves.

### What happens next depends entirely on the level
| | |
|---|---|
| \`MEMORY_ONLY\` | **recomputed** — the lineage runs again, silently |
| \`MEMORY_AND_DISK\` | **read back from disk** — slower than memory, far faster than redoing it |

That's the whole practical difference between the two defaults.

### The failure mode worth naming
A cache **too big to fit** thrashes: evict, recompute, evict, recompute. Every action pays for the last one's eviction.

The symptom is a job that got *slower* after someone added caching — which reads as impossible, and isn't.

> If \`Fraction Cached\` is well under 100% and the job is slow, un-caching is often the fix.`,
  narration:
    "When memory runs short and execution needs space, storage gives some back. The policy is least-recently-used, and it operates on whole partitions. A partition is never half-cached — the unit that arrived is the unit that leaves. That's worth knowing because it means caching is granular at the partition level, not the row level, and a dataset with four partitions has only four things that can be evicted. What happens after eviction depends entirely on your storage level, and this is the whole practical difference between the two defaults. With MEMORY_ONLY, the partition is gone, so the next time anything needs it, Spark recomputes it from lineage. Silently. No warning, no log line you'd notice — just a slower job. With MEMORY_AND_DISK, the partition was written to local disk on the way out, so it gets read back. Slower than memory, dramatically faster than recomputing an expensive join. Now the failure mode I'd most like you to recognise, because it's counterintuitive. If you cache something too large to fit, you get thrashing. Partition one is evicted to make room for partition two. Then something needs partition one, so it's recomputed, which evicts partition two. Then something needs partition two. Every single action is paying for the previous action's eviction, and you've added all the overhead of caching with none of the benefit. The symptom is a job that got slower after someone added caching to make it faster — which sounds impossible and isn't. If Fraction Cached is well under a hundred percent and the job is slow, removing the cache is very often the fix.",
}
