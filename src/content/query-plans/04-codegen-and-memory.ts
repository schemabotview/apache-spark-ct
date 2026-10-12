import type { Section } from '../types'

export const codegenAndMemory: Section = {
  id: 'codegen-and-memory',
  title: 'Execution representation, memory management and code generation',
  scene: 'codegen-and-memory',
  focus: 'unified-memory',
  slide: `## Generated code and memory

### Whole-stage code generation
- Operators marked \`*(2)\` are **fused** into one generated Java function
- Parquet arrives in **columnar batches**; \`ColumnarToRow\` feeds the generated loop
- Exchanges are never fused: here, **3** codegen subtrees

### Unified memory (4.0.1 tuning guide)
- **M** = \`spark.memory.fraction\` (**0.6**) of heap − 300 MiB, shared by execution and storage
- **Execution** — shuffles, joins, sorts, aggregations — can **evict** cached blocks…
- …but only down to **R**, \`spark.memory.storageFraction\` (**0.5**) of M
- Storage can never evict execution

### The misconception
"Spark interprets one operator per row." Fused operators run as **one loop** of generated code.`,
  narration:
    "The physical plan is still a description. To run it, Spark generates code. Look at the markers in front of the operators: star and a number in brackets. Every operator marked star two, the scan's row conversion, the filter, the projection, the broadcast join, and the partial aggregate, was fused into a single generated Java function. Instead of passing each row from operator to operator, that function runs one tight loop that reads a row, filters it, joins it and adds it to the running totals. Parquet data arrives in columnar batches, and the column to row step feeds those batches into the loop. Exchanges break the chain. Code cannot be fused across a shuffle or a broadcast, so this query produced three separate code generation subtrees. The second half of execution is memory. The four point zero point one tuning guide describes a unified model. Of each executor's heap, after three hundred mebibytes are reserved, a fraction, point six by default, forms one shared region. Execution memory, used for shuffles, joins, sorts and aggregations, and storage memory, used for cached data, both draw from it. When execution needs space, it can evict cached blocks, but only down to a protected portion, half of the region by default. Storage can never evict execution. So the misconception to drop is that Spark interprets one operator at a time, row by row. Fused operators run as a single loop of generated code.",
}
