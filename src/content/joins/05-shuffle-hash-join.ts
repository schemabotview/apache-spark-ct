import type { Section } from '../types'

export const shuffleHashJoin: Section = {
  id: 'shuffle-hash-join',
  title: 'Shuffle hash join: the forgotten one',
  scene: 'joins-shuffle-hash',
  focus: 'diff',
  slide: `## Shuffle hash join: the forgotten one

Same shuffle as sort-merge. **Different thing done afterwards.**

### The difference is per-partition
| Sort-merge | Shuffle hash |
|---|---|
| sort both sides, then merge | build a hash map from the smaller side |
| streams — no memory ceiling | probe it with the larger side |
| spills gracefully | **the build side must fit** |

No sort at all. When one side genuinely fits in memory, that's a real saving.

### Why you rarely see it
\`spark.sql.join.preferSortMergeJoin\` is **\`true\`** by default, so Spark reaches for it only with a hint or when the size difference is unmistakable.

That default is deliberate: sort-merge degrades, hash joins die. Spark would rather your job be slow than dead.

> \`ShuffledHashJoin\` in the plan — worth recognising, rarely worth forcing.`,
  narration:
    "There's a third strategy that sits between the other two, and most people never knowingly run it. It's the shuffle hash join. It starts identically to sort-merge: both sides get shuffled by the join key, and that cost is exactly the same. The difference is what happens inside each partition once the data has landed. Sort-merge sorts both sides and merges them. Shuffle hash doesn't sort anything. Instead it takes the smaller of the two partitions and builds a hash map out of it in memory, then streams the larger partition through, doing one lookup per row. If one side genuinely fits, that's meaningfully faster — you've skipped a sort on both sides, and sorting is not cheap. So why is it rare? Because there's a configuration flag called preferSortMergeJoin, and it defaults to true. Spark will pick sort-merge unless you explicitly hint otherwise or the size difference is unmistakable. And that default is a deliberate, defensible choice, for the reason from the last section: sort-merge degrades under pressure and hash joins die. If the build side doesn't fit, you don't get a slow join, you get an out-of-memory error and a failed stage. Spark's designers decided they would rather your job be slow than dead, and for a batch system that runs unattended overnight, that's the right call. So this is one worth recognising in a plan — you'll see ShuffledHashJoin — and rarely worth forcing yourself.",
}
