import type { Scene } from '@graphlearning/flow'

// §6.11 — the baseline query at 1, 2 and 4 local cores (medians of 5), beside the executor and
// dynamic-allocation settings and their 4.0.1 defaults from the configuration guide.
export const executorResources: Scene = {
  id: 'executor-resources',
  title: 'Cores, memory and allocation',
  flow: 'TB',
  nodes: [
    {
      id: 'cores-table',
      kind: 'table',
      label: 'Baseline query, more cores',
      sub: 'median of 5',
      headers: ['master', 'map tasks', 'task ms min/med/max', 'median'],
      values: [
        ['local[1]', '3', '144 / 1,067 / 1,147', '2.84 s'],
        ['local[2]', '3', '143 / 1,003 / 1,112', '1.47 s'],
        ['local[4]', '4', '764 / 968 / 1,013', '1.33 s'],
      ],
    },
    {
      id: 'resource-config',
      kind: 'code',
      filename: 'spark-defaults: 4.0.1 defaults',
      label: `spark.executor.cores        # 1 on YARN
spark.executor.memory       1g
spark.executor.memoryOverheadFactor  0.10
spark.executor.minMemoryOverhead     384m
spark.dynamicAllocation.enabled       false
spark.dynamicAllocation.shuffleTracking.enabled
                                      true
spark.dynamicAllocation.executorIdleTimeout  60s`,
    },
  ],
  edges: [],
}
