import type { Section } from '../types'

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
