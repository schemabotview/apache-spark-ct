import type { Section } from '../types'

export const sortMergeJoin: Section = {
  id: 'sort-merge-join',
  title: 'Sort-merge join: the one that always works',
  scene: 'joins-sort-merge',
  focus: 'smj',
  slide: `## Sort-merge join: the one that always works

The default when neither side is small. Three phases — and people usually only describe the first.

### 1 · Shuffle both sides
\`hash(join key)\` → the same partition id on both sides. Matching rows now share a machine.

### 2 · Sort each partition
By the join key, on **both** sides. Spills to disk if it doesn't fit.

### 3 · Merge in one pass
Two cursors walk the sorted runs in lockstep. Nothing is held whole.

### Why sort at all?
Hashing already put the matches on the same machine — so why pay for a sort?

**Because the sort is what lets the merge stream.** Neither side has to fit in memory, so this strategy *degrades* under pressure (it spills) rather than *dying* (OOM).

That's why it's the default: it's not the fastest, it's the one that always finishes.`,
  narration:
    "When neither side is small enough to broadcast, the default is the sort-merge join. Most explanations say it shuffles both sides and leave it there, which skips the half that costs you. There are three phases. First, both sides get shuffled by the join key. Hash of customer id, modulo the number of partitions, applied to orders and to customers identically — so every row with customer id forty-two, from either table, ends up in the same partition on the same machine. Second, each of those partitions gets sorted by the join key. Both sides. And if a partition doesn't fit in memory, that sort spills to disk. Third, the merge itself: two cursors walk the two sorted runs in lockstep, and because both are ordered by the same key, one pass finds every match. Now here's the question worth asking. The hashing already brought matching rows to the same machine. Why pay for a sort on top? And the answer is the reason this is the default strategy. The sort is what lets the merge stream. Because both sides arrive in order, the merge only ever needs to look at the current position in each — it never needs either side held in memory as a whole. So a sort-merge join has no memory ceiling. If a partition is too big, it spills to disk and carries on, slowly. It degrades. Compare that to a hash join, which either fits or dies with an out-of-memory error. Sort-merge isn't chosen because it's fastest. It's chosen because it's the one that always finishes.",
}
