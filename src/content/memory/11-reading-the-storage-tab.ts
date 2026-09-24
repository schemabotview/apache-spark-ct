import type { Section } from '../types'

export const readingTheStorageTab: Section = {
  id: 'reading-the-storage-tab',
  title: 'Reading the Storage tab',
  scene: 'mem-storage-tab',
  focus: 'table',
  slide: `## Reading the Storage tab

Four numbers that between them answer *"is my caching doing anything at all?"*

| Read | Healthy | Otherwise |
|---|---|---|
| **Fraction Cached** | 100% | partitions evicted, or never filled |
| **Size in Memory** | what you expected | far larger — deserialized objects are big |
| **Size on Disk** | zero | it didn't fit; \`MEMORY_AND_DISK\` caught it |
| **GC Time** *(Executors)* | a few % | a third — the heap is too full, cache included |

**Nothing listed at all** → you called \`cache()\` but never ran an action. It's lazy.

### The rule the whole course argues for
**Cache a parent that is expensive, shared and reused — and measure.**

Otherwise don't. Caching is not free, it competes with execution for the same pool, and used wrongly it makes jobs slower rather than faster.

> \`Size in Memory\` being 5× the source file isn't a bug. It's the object tax, and it's why \`_SER\` exists.`,
  narration:
    "Let's finish with where to look, because all of this is visible and almost nobody checks it. Open the Spark UI, go to the Storage tab, and there are four numbers worth reading. Fraction Cached is the first and most important. It should be a hundred percent. If it's sixty percent, then forty percent of what you asked to cache isn't cached, and every action touching that data is recomputing or reading from disk without telling you. That single number resolves most confusion about caching. Size in Memory is next. Compare it to what you expected. If your source file is two gigabytes and Size in Memory says ten, that's not a bug — that's the object overhead we talked about, deserialized JVM objects being much larger than compressed columnar bytes on disk. It's also exactly why the serialized storage levels exist. Size on Disk should ideally be zero. If it's not, your cache didn't fit in memory and MEMORY_AND_DISK caught the overflow — which is the system working, but it's telling you something. And then over on the Executors tab, GC Time as a fraction of task time. A few percent is normal. A third means the heap is too full, and your cache is part of why. One more: if nothing is listed at all on the Storage tab, you called cache and never ran an action. It's lazy. And the rule the whole course argues for: cache a parent that is expensive, shared and reused, and then measure whether it helped. Otherwise don't. Caching is not free — it competes with execution for the same pool — and used carelessly it makes jobs slower rather than faster.",
}
