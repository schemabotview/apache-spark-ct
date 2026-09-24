import type { Section } from '../types'

export const narrowDependency: Section = {
  id: 'narrow-dependency',
  title: 'Narrow dependencies, and the three things they buy',
  scene: 'rdd-narrow',
  focus: 'gifts',
  slide: `## Narrow dependencies

**Each output partition reads exactly one input.**

\`map\` · \`filter\` · \`flatMap\` · \`mapPartitions\` · \`union\`

No row ever needs to know about a row elsewhere. Partition 0 becomes 0′ on the same machine, start to finish.

### Three things this buys at once
| | |
|---|---|
| **Pipelining** | ten steps collapse into **one pass** |
| **No network** | work happens where the data is |
| **Cheap recovery** | one lost partition → **one** parent |

Filter-then-map-then-filter doesn't make three passes. Spark fuses them: read a row, apply all three, move on. **Nothing intermediate is materialised.**

> A single wide operation in the middle cuts the chain in two, and both halves pay the boundary.`,
  narration:
    "Dependencies come in exactly two kinds, and this distinction is the most useful thing in this course. A narrow dependency means each output partition reads exactly one input partition. Map, filter, flatMap, mapPartitions, union — all narrow. Picture partition zero on host A. Apply a filter, and you get a new partition zero-prime, built entirely from the old partition zero, still on host A. No row ever needed to know about a row anywhere else. Three things come from that, and they arrive together. First, pipelining. This one is bigger than people realise. If you write a filter, then a map, then another filter, Spark does not make three passes and build two intermediate collections. It fuses them into one: read a row, apply all three operations to it, move on to the next row. Nothing intermediate is ever materialised anywhere. Second, no network. The work happens where the data already sits, so nothing crosses the wire. Third, cheap recovery. If you lose one output partition, there's exactly one parent partition to recompute. One, not many. So Spark works quite hard to keep a run of operations narrow for as long as possible, because everything I just described is free until that run ends. And this is the practical bit: a single wide operation dropped in the middle of a narrow chain cuts it in two, and both halves pay for the boundary. If you have a filter that removes ninety percent of your rows, doing it before a groupBy rather than after it means ninety percent less data crosses the network. Same result, completely different cost. That's the whole skill.",
}
