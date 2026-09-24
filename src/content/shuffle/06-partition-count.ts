import type { Section } from '../types'

export const partitionCount: Section = {
  id: 'partition-count',
  title: 'Why 200, and what to use instead',
  scene: 'shuffle-partition-count',
  focus: 'code',
  slide: `## Why 200, and what to use instead

\`spark.sql.shuffle.partitions = 200\`. It is a **hardcoded default**, not a measurement. It knows nothing about your data, your cluster, or this query.

### Both directions hurt
| Too few | Too many |
|---|---|
| 40 GB / 200 = **200 MB a task** | 40 MB / 200 = **200 KB a task** |
| Spills, GC, OOM (§5) | Scheduling overhead dwarfs the work |
| | Tasks finishing in milliseconds |

### Size it from the data
\`\`\`
partitions ≈ shuffled bytes ÷ 128 MB
\`\`\`
Then round **up to a multiple of total cores** — otherwise the last wave runs with most of the cluster idle.

### \`repartition\` vs \`coalesce\`
Not interchangeable — the code card has both. ⚠️ **\`coalesce(1)\` before a write** drags the *whole upstream stage* to one task.`,
  narration:
    "So your job has two hundred tasks after every shuffle and you didn't ask for that. Where does two hundred come from? It's the default value of spark dot sql dot shuffle dot partitions, and the honest answer about why it's two hundred is: somebody had to pick a number. It is a hardcoded constant. It knows nothing about how much data you're shuffling, how big your cluster is, or what this query does. It's the same two hundred whether you're moving forty megabytes or forty terabytes. And it hurts in both directions. Shuffle forty gigabytes through two hundred partitions and each task is handling two hundred megabytes — that's the spilling we just talked about. But go the other way: shuffle forty megabytes through two hundred partitions and each task gets two hundred kilobytes, which takes longer to schedule than to compute. You'll see tasks completing in single-digit milliseconds, which is a sign you have too much parallelism, not too little. So size it from the data instead. Take roughly the bytes you're shuffling, divide by something like a hundred and twenty-eight megabytes, and that's your ballpark. Then round it up to a multiple of your total core count — because if you have forty cores and three hundred and ten partitions, the last wave runs eight tasks while thirty-two cores sit idle. One more thing, and it's the trap people fall into constantly. Repartition and coalesce are not two spellings of the same operation. Repartition does a full shuffle and gives you even partitions. Coalesce avoids the shuffle by merging neighbouring partitions in place, which sounds strictly better until you write coalesce of one before saving a file — because that doesn't just merge the output, it drags your entire upstream stage down to a single task.",
}
