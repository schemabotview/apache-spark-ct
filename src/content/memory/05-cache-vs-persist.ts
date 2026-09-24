import type { Section } from '../types'

export const cacheVsPersist: Section = {
  id: 'cache-vs-persist',
  title: 'cache() vs persist(), and the default that differs',
  scene: 'mem-cache-vs-persist',
  focus: 'defaults',
  slide: `## cache() vs persist()

\`cache()\` is \`persist()\` with the default level. Nothing else.

### And the default differs by API — a genuine trap
| | |
|---|---|
| \`rdd.cache()\` | **MEMORY_ONLY** — drops partitions that don't fit |
| \`df.cache()\` | **MEMORY_AND_DISK** — spills them instead |

Same method name, two behaviours. The DataFrame default is the safer one, and it's why RDD caching bites harder.

### Both are lazy. \`unpersist()\` is not.
\`\`\`python
df.cache()        # marks it. Nothing happens.
df.count()        # NOW it fills
\`\`\`

And a *partial* action fills it **partially**:
\`\`\`python
df.cache(); df.take(1)   # caches ONE partition
\`\`\`
Silently. The Storage tab shows a tiny fraction cached and no warning anywhere.

> \`unpersist()\` is eager, and worth calling when you're done — that memory is execution's otherwise.`,
  narration:
    "Cache and persist get talked about as though they're different things. They're not: cache is exactly persist called with the default storage level. That's the whole difference. But there's a trap in the word default, because it isn't the same default for both APIs. Calling cache on an RDD gives you MEMORY_ONLY. Calling cache on a DataFrame gives you MEMORY_AND_DISK. Same method name, materially different behaviour. MEMORY_ONLY means: if a partition doesn't fit, drop it, and recompute it when needed. MEMORY_AND_DISK means: if it doesn't fit in memory, write it to local disk and read it back. The DataFrame default is much safer, and it's a large part of why RDD caching catches people out more. Second thing, and this one causes a lot of confused debugging. Both are lazy. Calling cache does not cache anything. It marks the DataFrame as something to cache the next time it's computed. Nothing happens until an action runs. So the idiom is: call cache, then call count, and the count is what actually fills it. And there's a sharper version of the same trap. If your action only touches part of the data, only that part gets cached. Call cache and then take one row, and Spark caches exactly one partition. You look at the Storage tab, see a tiny fraction cached, and wonder what went wrong. Nothing went wrong; you only asked for one row. Finally, unpersist. That one is eager — it takes effect immediately — and it's worth calling when you're finished with something, because until you do, that memory belongs to storage and execution has to fight for it.",
}
