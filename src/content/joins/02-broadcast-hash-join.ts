import type { Section } from '../types'

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
