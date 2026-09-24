import type { Section } from '../types'

export const theExecutorBudget: Section = {
  id: 'the-executor-budget',
  title: 'Where 16 GB actually goes',
  scene: 'mem-executor-budget',
  focus: 'sum',
  slide: `## Where 16 GB actually goes

\`spark.executor.memory = 16g\` is the **JVM heap**, and rather less than all of it is yours.

| Region | Size |
|---|---|
| **Reserved** | 300 MB, not negotiable |
| **The unified pool** | 60% of (heap − 300 MB) — execution *and* storage |
| **User memory** | the rest — your objects, UDF state |

### And a fourth region, outside the heap
\`spark.executor.memoryOverhead\` — thread stacks, network buffers, **Python workers**. The *container* must hold this, and **the kernel enforces it**, not the JVM.

### So: ask for 16 GB, get about 9 GB to work with
Which is why *"it has 16 GB, why did it OOM?"* is the wrong question.

> Exceed the heap → a Java \`OutOfMemoryError\`. Exceed the **container** → \`exit 137\`, no stack trace, nothing to catch.`,
  narration:
    "Let's start by dividing up what you actually asked for, because the arithmetic surprises people. You set executor memory to sixteen gigabytes. That number is the JVM heap size, and substantially less than all of it is available to your job. First, three hundred megabytes is reserved for Spark's own internal objects. That's fixed and not configurable in any way you should be using. Of what remains, sixty percent — that's spark dot memory dot fraction — becomes the unified pool. This is the interesting region, shared between execution and storage, and we'll spend most of this course on it. What's left, the other forty percent, is user memory. That's for objects your own code creates: anything you allocate inside a UDF, data structures you build in a mapPartitions. Spark doesn't manage it or track it. Then there's a fourth region, and it lives outside the heap entirely: memory overhead. Thread stacks, network buffers for shuffle transfers, and — if you're using PySpark — the Python worker processes. This memory is part of your container's allocation even though the JVM knows nothing about it. So do the arithmetic. Sixteen gigabytes, minus three hundred megabytes reserved, times sixty percent, gives you around nine gigabytes in the unified pool. And that's the number that matters for caching and for shuffles. This also explains two different failure modes. Exceeding the heap gives you a Java OutOfMemoryError, which Spark catches and reports. Exceeding the container gives you exit code one-three-seven, because the kernel killed the process, and there is no Java error at all.",
}
