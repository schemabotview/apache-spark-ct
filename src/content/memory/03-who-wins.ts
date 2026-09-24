import type { Section } from '../types'

export const whoWins: Section = {
  id: 'who-wins',
  title: 'Who evicts whom',
  scene: 'mem-who-wins',
  focus: 'why',
  slide: `## Who evicts whom

\`spark.memory.storageFraction\` (0.5) is **not a reservation.** It's only the **floor storage is allowed to defend.**

| | |
|---|---|
| **Execution evicts storage** | down to that floor, whenever it needs to |
| **Storage never evicts execution** | it waits, or spills to disk instead |

### Why the asymmetry is right
One of these can be rebuilt for free; the other can't be rebuilt at all.

- **Evicted cache** → lineage recomputes it. You lose *time*.
- **Evicted execution state** → mid-shuffle, that work is simply *gone*.

So Spark protects the thing it can't rebuild — and **your cache is the thing it's willing to lose.**

### Which answers "why did my cache disappear?"
It didn't disappear. A large join legitimately took the memory back, exactly as designed, and nothing told you.

> Check **Fraction Cached** in the Storage tab. It's frequently well under 100%.`,
  narration:
    "Here's the rule, and it's the thing to take away from this course. There's a setting called storageFraction, defaulting to zero point five, and almost everyone misreads it. It is not a reservation. It does not mean half the pool belongs to storage. It means: this is the floor that storage is allowed to defend. Above that floor, storage is borrowing, and the loan can be called at any time. The borrowing is asymmetric. Execution can evict storage, down to that floor, whenever it needs the space. Storage can never evict execution — if execution is holding memory, storage waits, or spills to disk instead. Now, why is that the right design? Because the two things are not equally replaceable. If cached data is evicted, Spark knows exactly how to get it back: the lineage graph says how that partition was computed, so it recomputes it. You lose time. You do not lose correctness. But if execution state were evicted mid-operation — half a hash table, a partially accumulated aggregate — that work is simply gone, and there's no recipe to rebuild it from. So Spark protects the thing it cannot rebuild, and your cache is the thing it is willing to lose. Which gives the answer to the most common confused bug report in Spark: my cache disappeared. It didn't disappear. You cached a DataFrame, then ran a large join, and that join legitimately claimed the memory back. Everything worked exactly as designed, and nothing told you. Go and look at Fraction Cached in the Storage tab. It's very frequently well under a hundred percent, and people have no idea.",
}
