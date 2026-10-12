import type { Scene } from '@graphlearning/flow'

// §5.4 — whole-stage code generation as the *(n) markers in 4.0.1's physical plan (AQE off so the
// static plan shows them; trimmed), beside the unified memory model from the 4.0.1 tuning guide.
export const codegenAndMemory: Scene = {
  id: 'codegen-and-memory',
  title: 'Generated code and unified memory',
  flow: 'TB',
  nodes: [
    {
      id: 'codegen-plan',
      kind: 'code',
      filename: 'explain() — *(n) = codegen stage',
      label: `*(3) HashAggregate(keys=[city], [count, sum])
+- Exchange hashpartitioning(city, 200)
   +- *(2) HashAggregate(partial_count, partial_sum)
      +- *(2) Project [amount, city]
         +- *(2) BroadcastHashJoin [store_id] ...
            :- *(2) Project [store_id, amount]
            :  +- *(2) Filter (status = COMPLETED ...)
            :     +- *(2) ColumnarToRow
            :        +- FileScan parquet
            +- BroadcastExchange
               +- *(1) Filter isnotnull(store_id)
# explain("codegen"): Found 3 WholeStageCodegen
#   subtrees`,
    },
    {
      id: 'executor-heap',
      label: 'Executor JVM heap',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'reserved-memory', label: 'Reserved', sub: '300 MiB', pattern: 'external', icon: 'lock' },
        {
          id: 'unified-memory',
          label: 'Unified (M)',
          sub: '60% of heap − 300 MiB',
          pattern: 'service',
          cols: 1,
          children: [
            { id: 'execution-memory', label: 'Execution', sub: 'shuffles, joins, sorts', icon: 'gears' },
            { id: 'storage-memory', label: 'Storage (R)', sub: '50% of M kept for cache', icon: 'database' },
          ],
        },
        { id: 'user-memory', label: 'User', sub: 'the other 40%', pattern: 'storage', icon: 'boxes' },
      ],
    },
  ],
  edges: [],
}
