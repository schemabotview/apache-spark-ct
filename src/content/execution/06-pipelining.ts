import type { Section } from '../types'

export const pipelining: Section = {
  id: 'pipelining',
  title: 'Pipelining: three steps, one pass',
  scene: 'exec-pipelining',
  focus: 'actual',
  slide: `## Pipelining

### What people imagine three narrow steps cost
Three passes over the data, and two intermediate collections nobody asked for.

### What it actually costs
**One pass.** Read a row, apply all three operations to it, move on to the next row.

\`\`\`
for row in partition:
    if f1(row) and (r := m(row)) and f2(r):
        emit(r)
\`\`\`

Nothing intermediate is ever materialised. There is no "collection after the filter" — it doesn't exist as a thing in memory.

### Where the fusion stops
- **A wide dependency** — the stage boundary, every time
- **An opaque function** — a Python UDF Spark can't see into, so it can't fuse across it

> This is why "how many transformations" is the wrong question. Ten narrow steps and one narrow step cost about the same. **One wide step costs more than all of them.**`,
  narration:
    "Here's a mental model worth correcting, because it changes how you write. Most people imagine that if you chain a filter, then a map, then another filter, Spark makes three passes over your data and builds two intermediate collections along the way. That's how it would work if you wrote it with lists in plain Python. It is not how Spark works. What actually happens is one pass. Spark reads a row, applies the filter, applies the map, applies the second filter, and if it survives all three, emits it. Then it moves to the next row. There is no collection sitting in memory after the first filter, because that collection never exists as a thing. It was never built. This is called pipelining, and it happens at and below the level of partitions. The practical consequence is that the number of narrow transformations you write barely matters. Ten narrow steps and one narrow step cost about the same, because either way it's one pass over the rows with some function applied. So the question how many transformations is the wrong question to be asking about performance. The right question is how many wide ones. One wide step costs more than all ten narrow ones put together, because it ends the fusion, writes everything to disk, and moves it across the network. Two things stop the fusion. A wide dependency, which is the stage boundary and is unavoidable when you genuinely need to regroup data. And an opaque function — a Python UDF, for instance, which Spark cannot see inside and therefore cannot fuse across. That second one is worth remembering: dropping one Python UDF into an otherwise clean chain can break the pipeline around it.",
}
