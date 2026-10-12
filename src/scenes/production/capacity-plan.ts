import type { Scene } from '@graphlearning/flow'

// §8.4 — the course's fixed numbers turned into a capacity plan: container size with the default
// memory overhead, waves for the daily run, and machine-hours for the year backfill at 2 GB/s each.
export const capacityPlan: Scene = {
  id: 'capacity-plan',
  title: 'Capacity and cost',
  flow: 'TB',
  nodes: [
    {
      id: 'executor-sizing',
      kind: 'code',
      filename: 'one executor, as requested',
      label: `spark.executor.cores          4
spark.executor.memory         16g
# memoryOverhead default: max(384 MB, 10%)
container = 16 GB + 1.6 GB ≈ 17.6 GB
50 executors = 200 slots, ~880 GB requested
daily: 1,600 tasks / 200 slots = 8 waves`,
    },
    {
      id: 'cost-table',
      kind: 'table',
      label: 'Scanning a year (70 TB) at 2 GB/s per machine',
      sub: 'ideal scaling, before overhead',
      headers: ['machines', 'time', 'machine-hours'],
      values: [
        ['1', '≈ 10 h', '≈ 10'],
        ['25', '≈ 24 min', '≈ 10'],
        ['50', '≈ 12 min', '≈ 10'],
      ],
    },
  ],
  edges: [],
}
