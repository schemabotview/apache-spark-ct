import type { Section } from '../types'

export const whyLazyPays: Section = {
  id: 'why-lazy-pays',
  title: 'What laziness buys, and what it costs',
  scene: 'exec-why-lazy',
  focus: 'lazy',
  slide: `## What laziness buys

### If Spark ran each line eagerly
Read one billion rows. Then throw away all but a thousand of them.

### Because it waited, it can rearrange
| | |
|---|---|
| **Predicate pushdown** | the filter moves *into* the read — rows never enter memory |
| **Column pruning** | read 3 columns out of 200 |
| **Operator fusion** | ten steps become one pass |

None of that is possible once you've already started reading.

### The price
**Errors surface at the action, far from the line that caused them.**

A typo in a column name on line 4 doesn't fail on line 4. It fails 200 lines later at \`.show()\`, with a stack trace pointing at \`.show()\`.

> Analysis errors *are* caught early — the analyzer resolves names before anything runs. It's the runtime ones that arrive late.`,
  narration:
    "Let's be concrete about what laziness actually buys, because it's not a small optimisation. Picture the eager version. Line one reads a billion rows into memory. Line two filters them down to a thousand. You have done a billion rows of work to keep a thousand, and there is no way to undo it. Now the lazy version. Spark has the whole chain before it starts, so it can rearrange it. Three things fall out. Predicate pushdown: the filter is moved down into the file reader itself, so those rows are never read off disk in the first place — not read then discarded, never read. Column pruning: your query mentions three columns, so a columnar format like Parquet reads only those three, and the other hundred and ninety-seven are never touched. And operator fusion: a run of narrow operations collapses into a single pass over the rows, with nothing intermediate materialised. Every one of those requires knowing the end of the chain before starting the beginning. Now the price, because there is one, and it's the thing that makes Spark frustrating to debug when you're new. Errors surface at the action, far from the line that caused them. You write a transformation on line four with a bug in it, and line four returns cheerfully. Two hundred lines later you call show, and it fails — with a stack trace pointing at show, which is not where the problem is. One thing that softens this: analysis errors are caught early. If you reference a column that doesn't exist, the analyzer resolves names as you build the plan, and you'll find out immediately. It's the runtime errors — a bad cast, a division by zero, a malformed row — that arrive late and in the wrong place.",
}
