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
