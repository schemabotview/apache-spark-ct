import type { Section } from '../types'

export const storageLevels: Section = {
  id: 'storage-levels',
  title: 'The storage levels',
  scene: 'mem-storage-levels',
  focus: 'table',
  slide: `## The storage levels

Three independent choices: **memory or disk**, **deserialized or serialized**, **replicated or not.**

| | |
|---|---|
| \`MEMORY_ONLY\` | objects in memory; drops whole partitions that don't fit |
| \`MEMORY_AND_DISK\` | memory first, the rest serialized to disk |
| \`MEMORY_ONLY_SER\` | serialized in memory — smaller, CPU to decode |
| \`DISK_ONLY\` | serialized on disk, always |
| \`..._2\` | any level, replicated to a second node |
| \`OFF_HEAP\` | outside the JVM heap, in Tungsten memory |

### The deserialized / serialized trade
**Deserialized** is fast to read and large — real JVM objects, with the object tax.
**Serialized** is compact and costs CPU on every single read.

If you're memory-bound and have CPU to spare, \`_SER\` is a real win. If you're CPU-bound it makes things worse.

> \`_2\` looks wasteful and occasionally isn't: if losing a partition means a 40-minute recompute, a second copy is cheap insurance.`,
  narration:
    "The storage levels look like a long list and they're really three independent yes-or-no choices, combined. Memory or disk. Deserialized or serialized. Replicated or not. MEMORY_ONLY keeps partitions as JVM objects in memory, and drops any that don't fit — those get recomputed when needed. MEMORY_AND_DISK keeps what fits in memory and writes the rest to local disk, serialized. That's the DataFrame default and it's the sensible starting point. MEMORY_ONLY_SER keeps everything in memory but serialized, which is much more compact — remember the object overhead problem, where a three-byte string costs forty-eight bytes as an object. Serialized form avoids that, at the cost of CPU to decode on every read. DISK_ONLY skips memory entirely, which makes sense when recomputation is more expensive than a disk read — an expensive join, say, where reading from local SSD beats redoing the join. The underscore-two variants replicate to a second node. And OFF_HEAP puts data outside the JVM heap in Tungsten-managed memory, where garbage collection never sees it. The key trade is deserialized versus serialized. Deserialized is fast to read and large. Serialized is compact and costs CPU on every read. So if you're memory-bound and have CPU headroom, the SER variants are a genuine win. If you're CPU-bound, they make things worse. That's a thing to measure rather than guess. And replication looks wasteful until you consider the case where losing a partition means a forty-minute recomputation. Then a second copy is cheap insurance.",
}
