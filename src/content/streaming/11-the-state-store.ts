import type { Section } from '../types'

export const theStateStore: Section = {
  id: 'the-state-store',
  title: 'The state store',
  scene: 'str-state-store',
  focus: 'watch',
  slide: `## The state store

Where a running aggregate actually lives. Partitioned by the grouping key, versioned per batch, and written to the checkpoint so a restart can resume.

| | |
|---|---|
| **In the executor** | for speed, during the batch |
| **In the checkpoint** | for survival, between them |

### Two providers, and the choice is about size
| | |
|---|---|
| **HDFS-backed** *(default)* | all state in the **JVM heap** — GC pressure grows with it |
| **RocksDB** | spills to local disk — for large state |

\`\`\`
spark.sql.streaming.stateStore.providerClass
\`\`\`
If your state is a few million keys, the default is fine. If it's hundreds of millions, the default becomes a GC problem long before it becomes a memory error.

### The number to watch, from day one
\`numRowsTotal\` in the query progress output.

**If it only ever rises, something never expires** — a missing watermark, or a key space that grows forever. Catch that in week one, not in month six when the job stops restarting successfully.`,
  narration:
    "Let's look at where state actually lives, because it's the thing most likely to end a streaming job that's been running happily for months. State is partitioned by the grouping key, exactly as shuffled data is — so the state for a given key always lives on the executor handling that key's partition. It's versioned per batch, which is what allows a restart to roll back to a consistent point. And it's written to the checkpoint, which is how it survives a restart at all. So it lives in two places: in the executor for speed during a batch, and in the checkpoint for survival between them. There are two implementations. The default keeps all state in the JVM heap, backed by files in the checkpoint. That's simple and fast, and it works well until your state gets large — at which point you have hundreds of millions of objects on the heap, and the garbage collector becomes your bottleneck long before you actually run out of memory. RocksDB is the alternative: an embedded key-value store that keeps hot state in memory and spills the rest to local disk. For large state it's substantially better, because the JVM heap stops growing with your key count. Now the number I'd most like you to watch, from the first day a streaming job goes live. In the query progress output there's a field called numRowsTotal, which is how many rows are in the state store. Watch its trend. If it only ever rises, something never expires — a missing watermark, or a key space that grows forever, like session ids that are never reused. Catch that in week one. The alternative is discovering it in month six, when the job stops being able to restart because loading state takes longer than the trigger interval.",
}
