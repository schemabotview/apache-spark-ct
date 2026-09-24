import type { Section } from '../types'

export const readingExplain: Section = {
  id: 'reading-explain',
  title: 'Reading the plan',
  scene: 'exec-reading-explain',
  focus: 'code',
  slide: `## Reading the plan

\`df.explain()\` — and **read it bottom-up.** The scan is the leaf; the last operation is at the top.

### The three things to look for
| | |
|---|---|
| \`Exchange\` | a shuffle. **Count them** — that's the cost of your query. |
| \`ReadSchema\` | which columns are actually read. Fewer than the table has = **column pruning worked**. |
| \`PushedFilters\` | filters that reached the file reader instead of running after the scan |

### Two HashAggregates is not a bug
The lower one is the **partial** aggregate, before the shuffle. The upper one finishes the job after it. Seeing both means the map-side combine is happening.

### Other modes
\`\`\`
df.explain("formatted")  # per-node detail
df.explain("cost")       # with size estimates
\`\`\`

> This is the only honest answer about what Spark will do. Everything else is a guess.`,
  narration:
    "Let's finish with the tool that makes all of this checkable rather than theoretical. Call explain on any DataFrame and you get the physical plan. The first thing to know is to read it bottom-up. The leaf at the bottom is the file scan, and execution flows upward to the last operation at the top. It reads like a tree, because it is one. Three things to look for. First, Exchange. Every Exchange is a shuffle, which means a stage boundary, a disk write, a network fetch, and a barrier. Count them. That count is essentially the cost of your query, and you can see it without running anything. Second, ReadSchema. This tells you which columns are actually going to be read. If your table has two hundred columns and ReadSchema lists three, column pruning worked and you're reading a fraction of the data. If it lists all two hundred, something in your query is forcing a full read, and that's worth investigating. Third, PushedFilters. These are the filters that made it all the way down into the file reader, so matching rows are skipped before they're ever decoded. A filter that isn't pushed still runs, just later and on more data. One thing that confuses people: seeing two HashAggregate operators for a single groupBy. That's not a bug or a duplication. The lower one is the partial aggregate that runs before the shuffle — the map-side combine — and the upper one finishes the job after it. Seeing both is the sign that Spark is combining early, which is what you want. There are richer modes too: explain formatted gives an operator list with per-node detail, and explain cost includes size estimates, which is how you check whether the optimizer's guess about a table's size is anywhere near reality.",
}
