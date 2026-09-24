import type { Section } from '../types'

export const aRealLineage: Section = {
  id: 'a-real-lineage',
  title: 'One query, end to end',
  scene: 'exec-real-lineage',
  focus: 'chain',
  slide: `## One query, end to end

\`\`\`
df.groupBy("dest").sum("count")
  .orderBy(desc("sum")).limit(5).collect()
\`\`\`

One action. **Two shuffles. Three stages** — and the task count changes at every boundary.

| | |
|---|---|
| **Stage 0** — 8 tasks | scan 8 files, **partial aggregate** per partition |
| ↓ \`Exchange\` by key | the \`groupBy\` |
| **Stage 1** — 200 tasks | final aggregate, then a local top-5 per partition |
| ↓ \`Exchange\` to one | the \`orderBy\` + \`limit\` |
| **Stage 2** — 1 task | merge 200 local top-5s, take 5 |

### Two things worth noticing
**The partial aggregate in Stage 0.** Spark combines *before* shuffling, so only one row per key per partition crosses the network.

**Stage 2 has one task** — a global sort needs one place. That single task is a bottleneck by construction, which is why \`limit\` after a sort is fine and a full sort of everything isn't.`,
  narration:
    "Let's put the whole course together on one real query: group by destination, sum the counts, sort descending, take the top five, collect. One action — collect — so one job. Two shuffles, so three stages. Watch the task counts change. Stage zero has eight tasks, one per input file. It scans, and it does something clever: a partial aggregate, per partition. Before anything moves, each partition sums its own rows down to one row per destination it saw. Stage zero ends at an Exchange that partitions by destination — that's the groupBy needing all rows for a key together. Stage one has two hundred tasks, because two hundred is the shuffle default. It finishes the aggregate, and then computes a local top five within each partition. Stage one ends at a second Exchange, this time to a single partition, because a global sort has to happen somewhere. Stage two has exactly one task: it merges two hundred local top-fives and takes the overall five. Two things worth noticing. First, the partial aggregate in stage zero. That's the map-side combine, and it's why a groupBy followed by a sum is dramatically cheaper than it looks — only one row per key per partition ever crosses the network, rather than every row. Spark does that for you in the DataFrame API. Second, stage two has one task, and that's a bottleneck by construction. A global ordering has to be decided in one place. This is exactly why a limit after a sort is fine — each partition only sends its own top five — and why sorting an entire large dataset without a limit is something to think twice about.",
}
