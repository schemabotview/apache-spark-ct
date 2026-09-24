import type { Section } from '../types'

export const howSparkChooses: Section = {
  id: 'how-spark-chooses',
  title: 'How Spark actually chooses',
  scene: 'joins-how-spark-chooses',
  focus: 'ladder',
  slide: `## How Spark actually chooses

Not "pick the cheapest." **Walk a list, take the first rule that matches, stop.**

### Is there an equality in the condition?

**Yes** — in order:
1. **Broadcast hash** — a hint, or a side under the threshold
2. **Shuffle hash** — a hint, or \`preferSortMergeJoin\` is off
3. **Sort-merge** — the keys are sortable. The usual answer.

**No** — the fall-through:
- **Broadcast nested loop**, if one side is small enough to ship
- **Cartesian product**, if it isn't

### Why this matters more than it looks
Two consequences fall straight out of "first match wins":

- A **hint short-circuits the list**. It doesn't tip a balance — it ends the search.
- Everything above rule 3 depends on a **size estimate**. Bad statistics don't make Spark choose badly *sometimes* — they make it choose badly *deterministically*, every run, until the statistics change.`,
  narration:
    "Now that you've seen all five, here's how Spark picks between them — and the mechanism is simpler and blunter than people assume. It is not weighing costs and choosing the cheapest. It walks an ordered list of rules, and the first one that matches wins. The search stops there. The first question is whether your condition contains an equality. If it does, Spark goes down three rungs in order. Rung one: is there a broadcast hint, or is one side estimated to be under the threshold? If yes, broadcast hash join, done. Rung two: is there a shuffle-hash hint, or has somebody turned off preferSortMergeJoin, and is one side small enough to build a hash table from? If yes, shuffle hash join, done. Rung three: are the join keys sortable? Almost always yes, and you get a sort-merge join. That's the usual answer and the reason sort-merge is what you see most of the time. If there's no equality, you fall through to the other two: broadcast nested loop if one side is small enough to ship, and a full cartesian product if it isn't. Two consequences fall out of first-match-wins that are worth sitting with. First, a hint doesn't tip a balance — it ends the search. You're not advising the optimizer, you're overriding it. Second, everything above rung three depends on a size estimate. So bad statistics don't make Spark choose badly occasionally. They make it choose badly deterministically, the same wrong way on every single run, until somebody changes the statistics.",
}

export const joinTypesCost: Section = {
  id: 'join-types-cost',
  title: 'What the join type costs',
  scene: 'joins-types',
  focus: 'types',
  slide: `## What the join type costs

You know which rows each type *returns*. This is what each one does to the **plan**.

### The pattern
- **\`inner\`** is cheapest — a match is required, so filters push down to **both** sides
- **outer** joins remove that. Rows have to survive whether they match or not, so the filter can't be pushed through
- **\`full outer\`** rules out broadcast in most cases: both sides must shuffle

### The two that are underused
| | |
|---|---|
| **\`left semi\`** | left rows that match. No right columns, so it can stop at the **first** match. |
| **\`left anti\`** | left rows with **no** match. Must scan the whole right side to prove a negative. |

An \`EXISTS\` check written as an inner join **duplicates left rows** when the right side has several matches. \`left semi\` doesn't. It's the same answer, correct by construction, and usually faster.`,
  narration:
    "Join type is usually taught as a set-theory question — which rows come out the other side. That part you already know. What's less often said is that the type changes the plan, not just the result. Start with inner, which is the cheapest and it's worth understanding why. In an inner join, a row only survives if it has a match. That means a filter on either side can be pushed all the way down into the scan of both sides, because anything filtered out couldn't have contributed anyway. Now switch to a left outer join. Suddenly left rows have to survive whether or not they matched. That filter can no longer be pushed through the join, and you end up reading and carrying rows you'll discard later. Full outer is the most constrained of all: both sides have to be preserved entirely, which rules out broadcasting in most cases and forces both sides to shuffle. Then there are two types that are genuinely underused, and I'd encourage you to reach for them. Left semi returns left rows that have a match, but none of the right side's columns. Because it doesn't need the right columns, it can stop at the first match it finds rather than enumerating all of them. And that matters, because the common way people express does this exist is an inner join — which silently duplicates a left row once for every match on the right. Left semi gives the same answer, correct by construction, and usually faster. Left anti is its mirror: left rows with no match. That one is inherently more expensive, because proving a negative means scanning the whole right side.",
}

export const bucketingSection: Section = {
  id: 'bucketing',
  title: 'Bucketing: pay the shuffle once',
  scene: 'joins-bucketing',
  focus: 'conditions',
  slide: `## Bucketing: pay the shuffle once

Not a way to *avoid* a shuffle. A way to **move it in time** — out of every daily run, into one write.

\`\`\`
.bucketBy(320, "customer_id")
.sortBy("customer_id")
.saveAsTable("orders_bucketed")
\`\`\`

The table is now stored already partitioned by the join key. Every future join on that key shuffles **neither** side — no \`Exchange\` in the plan at all.

### The conditions — all of them, or nothing
| | |
|---|---|
| **Same column** | on both tables |
| **Same bucket count** | or a multiple, on Spark 3.1+ |
| **A managed table** | \`saveAsTable\`, not a bare path |

Miss one and you get **no error, no warning, and no benefit** — just the shuffle you thought you'd removed. Always confirm with \`explain()\`.

### When it's worth it
A table joined **the same way, repeatedly**. A fact table against a dimension, every night. One-off analysis: never.`,
  narration:
    "Bucketing gets described as a way to avoid a shuffle, and that's not quite right. It's a way to move a shuffle in time. Think about a nightly pipeline that joins orders to customers on customer id. Every night, both tables get shuffled by customer id. Monday, Tuesday, Wednesday — the same data, hashed the same way, moved across the same network, every single run. Bucketing says: do that once, at write time, and store the result. When you write a table with bucketBy on customer id, Spark hashes each row and writes it into the bucket its key belongs to, so the file layout on disk already reflects the partitioning a join would need. Then every future join on that column shuffles neither side. Not the small side, not the big side. There's no Exchange in the plan at all. That's a bigger saving than anything else in this course. The catch is that the conditions are strict and failing them is silent. Both tables must be bucketed on the same column. They must have the same number of buckets — or on Spark three point one and later, counts that are multiples of each other, which Spark can coalesce. And it has to be a managed table, written with saveAsTable, because the bucketing information lives in the metastore, not in the files. Miss any of those and you get no error and no warning. You just get the shuffle back, silently, and a pipeline that's slower than you believe it is. So always confirm with explain. And be clear about when this earns its complexity: a table joined the same way over and over. For one-off analysis it's never worth it.",
}

export const skewedJoinsSection: Section = {
  id: 'skewed-joins',
  title: 'Skewed joins, and why salting is now a last resort',
  scene: 'joins-skewed',
  focus: 'aqe',
  slide: `## Skewed joins, and why salting is now a last resort

One customer owns 40% of the orders. Every one of their rows hashes to **one partition**, handled by **one task** — and a stage ends with its slowest task.

### First: let Spark do it
\`spark.sql.adaptive.skewJoin.enabled\` — after the shuffle, Spark can **measure** the partitions and split the outliers itself.

| | |
|---|---|
| \`skewedPartitionFactor\` | 5× the median counts as skewed |
| \`skewedPartitionThresholdInBytes\` | 256 MB — and **both** tests must pass |

The big partition is cut into pieces; the matching rows on the other side are **duplicated** so every piece still finds its match.

### Only if that isn't enough: salting
Append \`rand(0, 9)\` to the hot key so one key becomes ten; **explode** the small side into all ten variants so matches still line up; join, then strip the salt.

The small side is now **10× larger** and the code is materially harder to read. This is the technique AQE automated — which is why it rarely earns its complexity now.`,
  narration:
    "Skew hits joins harder than anything else, and the standard advice about it is out of date. Here's the situation. One customer accounts for forty percent of your orders. Every row for that customer hashes to the same value, so every one of those rows goes to the same partition, handled by a single task. That task has forty percent of your data. And because a stage doesn't finish until its slowest task finishes, the whole join waits for it. Adding executors doesn't help — it's one thread on one core. Now, the technique everyone learned for this is salting, and I'll describe it, but I want to lead with what you should actually try first. On Spark 3, turn on adaptive skew join handling. After the shuffle, Spark has measured every partition, so it can see the outlier directly rather than guessing. When a partition is both more than five times the median size and over two hundred and fifty-six megabytes — both tests have to pass — it splits that partition into pieces and duplicates the matching rows from the other side so each piece still finds its match. That's the same idea as salting, done automatically, with real measurements instead of your estimate. Salting by hand is what you do when that isn't enough. You take the big side and append a random number from zero to nine to the hot key, turning one key into ten. Then you take the small side and explode every row into all ten variants so the matches still line up. Join, then strip the salt off. It works — but your small side is now ten times bigger, and anyone reading that code later has to reconstruct why. It's the technique AQE automated, and that's exactly why it rarely earns its complexity today.",
}

export const hintsSection: Section = {
  id: 'hints',
  title: 'Hints, and when overriding is defensible',
  scene: 'joins-hints',
  focus: 'code',
  slide: `## Hints, and when overriding is defensible

A hint **short-circuits the selection order**. It isn't advice — Spark obeys it, including when obeying is a bad idea.

### Defensible
- The table has **no statistics**, so the estimate is a guess
- It's small but Spark **can't know** that — behind a UDF, a subquery, a non-deterministic filter
- You **measured both plans** and the optimizer's pick was slower

### Not defensible
- *"Broadcasting fixed it once"* — then the table grew and the driver died. A hint is a constant; your data isn't.
- Before trying \`ANALYZE TABLE … COMPUTE STATISTICS\` — that fixes the cause rather than overriding the symptom
- Before turning **AQE** on, which re-decides with numbers it actually measured

### Either way, check what you got
\`\`\`
df.join(other, "key").explain()
\`\`\`
\`BroadcastHashJoin\` · \`SortMergeJoin\` · \`ShuffledHashJoin\` — the plan is the only honest answer.`,
  narration:
    "Last section: the override. You can tell Spark which join strategy to use, and the important thing to internalise is what that does mechanically. A hint short-circuits the selection ladder from a few sections back. It isn't a suggestion that gets weighed against other factors. Spark will do what you said, including when what you said is a bad idea. In the DataFrame API you wrap the side you want shipped in the broadcast function. In SQL there are four hints, one per strategy: BROADCAST, MERGE for sort-merge, SHUFFLE_HASH, and SHUFFLE_REPLICATE_NL for the nested loop. So when is using one defensible? Three cases, really. When the table has no statistics, so the optimizer's estimate is close to a guess and you know better. When the table is genuinely small but Spark can't know it — because it's behind a user-defined function, or a subquery, or a filter whose selectivity is unknowable. And when you've actually measured both plans and the optimizer's choice was slower. And when is it not defensible? The big one is what I'd call hint-by-superstition: broadcasting fixed a slow query once, so now there's a broadcast hint in the code forever. A hint is a constant. Your data isn't. That table grows, and one morning the driver dies instead of the query being slow, which is a much worse failure. The other two: don't reach for a hint before you've tried computing statistics, which fixes the cause rather than overriding the symptom. And don't reach for one before turning on adaptive execution, which re-decides using numbers it actually measured rather than numbers it guessed. Whatever you do — call explain and confirm what you got. The plan is the only honest answer.",
}
