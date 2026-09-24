import type { Section } from '../types'

export const theProblem: Section = {
  id: 'the-problem',
  title: 'What a join actually has to solve',
  scene: 'joins-the-problem',
  focus: 'gap',
  slide: `## What a join actually has to solve

\`orders ⋈ customers ON customer_id\`. The order is on host A. Its customer row is on host D. **Neither host knows the other has a match.**

### So exactly one of two things must happen
- **Move one side whole** — copy the small table to every machine
- **Move both by key** — repartition so matching rows land together

Every join strategy in Spark is one of those two answers. There is no third.

### The vocabulary the rest of this uses
| Term | Means |
|---|---|
| **build side** | the side held in memory as a lookup structure |
| **probe / stream side** | the side read through once, looking each row up |

The strategies differ on **which side is which**, and **what gets moved to make it possible**.`,
  narration:
    "Before we compare join strategies, it's worth being precise about the problem, because every strategy is an answer to this one question. You have a table of orders and a table of customers, and you want them joined on customer id. An order for customer forty-two is sitting on host A. Customer forty-two's row is sitting on host D. Neither of those machines knows the other one has a match. Nothing in the system has arranged for them to be together. So something has to move. And there are only two things that can possibly move. Either you take one entire table and copy it to every machine, so that wherever a row of the other table lives, its match is already there locally. Or you move both tables, partitioning each of them by the join key, so that all rows with customer id forty-two — from both sides — end up in the same place. That's it. Every join strategy Spark has is one of those two answers, dressed differently. Two pieces of vocabulary before we start, because every strategy uses them. The build side is whichever side gets held in memory as a lookup structure. The probe side, sometimes called the stream side, is the one that gets read through once, checking each row against that structure. What the strategies actually differ on is which side plays which role, and what has to be moved across the network to make it possible. Keep those two questions in your head and the five strategies stop being a list to memorise.",
}

export const broadcastHashJoin: Section = {
  id: 'broadcast-hash-join',
  title: 'Broadcast hash join: move the other side',
  scene: 'joins-broadcast',
  focus: 'cluster',
  slide: `## Broadcast hash join

The fastest join in Spark, because **the big side never moves.**

### How it runs
1. The driver **collects** the small side into its own memory
2. It **ships one copy to every executor** — not one per task
3. Each executor builds a **hash table** from it
4. Each task streams its own big partition through, probing locally

### What it costs, and what it doesn't
- **No shuffle.** No \`Exchange\` in the plan, no stage boundary, no sort.
- Network cost is \`small table × number of executors\` — not × number of tasks
- The big side stays exactly where it was read

### Why it isn't always chosen
The small side has to **fit in the driver's memory, then in every executor's**. That ceiling is the whole reason the other four strategies exist.

In the plan: \`BroadcastHashJoin\`.`,
  narration:
    "The first strategy is the one you want whenever you can have it, and it's called the broadcast hash join. The idea comes straight from the two options: if one of your tables is small, don't bother moving the big one at all. Just send a complete copy of the small table to every machine. Here's what actually happens. The driver collects the small side — the whole thing, into the driver's own memory. Then it broadcasts one copy to each executor. Note: one copy per executor, not per task, so if an executor is running eight tasks they all share the same hash table. Each executor builds a hash map from it, keyed on the join column. And now every task just reads its own partition of the big table, and for each row, does a hash lookup in the local map. One pass. No network. No shuffle at all — and that's the headline. There's no Exchange in the plan, which means no stage boundary, no writing files to local disk, no sorting. The network cost is the small table times the number of executors, which for a lookup table of a few thousand rows is nothing. So why isn't everything a broadcast join? Because the small side has to fit twice over — once in the driver's memory while it's being collected, and then in every single executor's memory alongside everything else that executor is doing. That ceiling is the entire reason the other four strategies exist. Everything that follows is about what to do when the small side isn't small enough.",
}

export const theThreshold: Section = {
  id: 'the-threshold',
  title: 'The 10 MB threshold, and what it measures',
  scene: 'joins-threshold',
  focus: 'measures',
  slide: `## The 10 MB threshold, and what it measures

\`spark.sql.autoBroadcastJoinThreshold\` = **10 MB**. Set to \`-1\` to turn broadcasting off entirely.

### The part people get wrong
It is **not** the file size on disk. It's the optimizer's **estimate of the size in memory**.

- 10 MB of Parquet is columnar, dictionary-encoded and compressed
- In memory it's decoded rows, JVM objects and hash-table overhead — often **5–10×** larger
- And if the table has no statistics, the "estimate" is close to a guess

\`\`\`
ANALYZE TABLE customers COMPUTE STATISTICS
\`\`\`
Without that, you're tuning a threshold against a number nobody measured.

### Both failure modes land on the driver
| | |
|---|---|
| **Driver OOM** | you forced \`broadcast()\` on something that wasn't small |
| **\`broadcastTimeout\`** | 300 s to collect and ship it, then the job dies |`,
  narration:
    "So Spark decides to broadcast when it thinks one side is under ten megabytes. That's the autoBroadcastJoinThreshold, and you can raise it, lower it, or set it to minus one to switch broadcasting off completely. But here's the part that trips people up, and it's worth being precise about. That ten megabytes is not the size of the file on disk. It's the optimizer's estimate of how big the table will be in memory. Those are very different numbers. Ten megabytes of Parquet is columnar, dictionary-encoded and compressed — it's about the most compact form that data will ever take. Decode it into JVM row objects and build a hash table over it, and you can easily be looking at fifty or a hundred megabytes of heap. So a table that looks comfortably under the threshold on disk can be well over it in practice. And it gets worse, because that's an estimate. If your table has never had statistics computed, Spark is working from whatever it can infer, and that inference can be badly wrong. Running analyze table compute statistics is the cheapest fix available and almost nobody does it — without it you're tuning a threshold against a number nobody has measured. Now, both ways this fails land on the driver, which is why they hurt. If you force a broadcast on something that isn't actually small, the driver runs out of memory collecting it, and the driver dying kills the whole application. And if the table is large but not quite fatal, you hit the broadcast timeout instead — five minutes to collect and ship it, and then the job fails anyway.",
}

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

export const nestedLoopJoin: Section = {
  id: 'nested-loop',
  title: 'Nested loop: the one you never want',
  scene: 'joins-nested-loop',
  focus: 'cost',
  slide: `## Nested loop: the one you never want

Every other strategy needs an **equality** to hash on. Take that away and only this is left.

### What forces it
- A **range** condition — \`ON a.ts BETWEEN b.start AND b.end\`
- An **inequality** — \`ON a.price > b.floor\`
- **No condition at all** — a cross join, usually written by accident

### The cost
\`\`\`
1M rows × 1M rows = 1,000,000,000,000 comparisons
\`\`\`
There is no partitioning to exploit, because there's no key to partition on. Nothing warns you.

### When the condition is genuinely non-equi
- **Broadcast the small side** — \`BroadcastNestedLoopJoin\`. Still O(n×m), but no shuffle.
- **Manufacture an equi-key** — join on the *day*, then filter the range inside it. One enormous comparison becomes many tiny ones.`,
  narration:
    "The last strategy is the one you hope never to see, and understanding why it exists tells you something about all the others. Every strategy so far depended on one thing: an equality in the join condition. An equals sign is what lets you hash. Hashing is what lets you decide, for a given row, which single partition its match must be in. Take away the equality and that whole mechanism collapses. If your condition is a range — a timestamp between a start and an end — there's no single partition a matching row must be in. It could be any of them. So Spark falls back to the only thing that's always correct: compare every row against every row. A million rows against a million rows is a trillion comparisons. And nothing warns you. The query is valid, the plan is valid, the job just never finishes. The most common way people hit this is an accidental cross join — a join condition that got dropped, or a condition that references only one side. So the first thing to do is look at the plan for the word CartesianProduct, because that's almost never what anyone meant. But sometimes the condition really is non-equality. You genuinely need every event whose timestamp falls inside a session window. Two things help. One, get the small side broadcast, which gives you a broadcast nested loop join — still order n times m, but with no shuffle at all. And two, manufacture an equality where you can: join on the calendar day first, then apply the range condition inside each day. You've turned one enormous comparison into a few hundred tiny ones.",
}
