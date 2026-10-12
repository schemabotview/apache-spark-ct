import type { Scene } from '@graphlearning/flow'

// §6.3 — five symptoms, the metric that shows each, and the value measured in this chapter's runs.
// The spill row is the 10,000,000-row sort under spark.driver.memory=1g.
export const resourceSymptoms: Scene = {
  id: 'resource-symptoms',
  title: 'Symptoms and the metric that shows them',
  flow: 'TB',
  nodes: [
    {
      id: 'symptom-table',
      kind: 'table',
      label: 'Read the metric before guessing',
      sub: 'all measured on local[4]',
      headers: ['symptom', 'metric', 'measured here'],
      values: [
        ['CPU-bound', 'CPU time vs run time', '2,556 of 3,275 ms (78%)'],
        ['GC pressure', 'GC time', '114 ms of 3,275 (3%)'],
        ['memory → spill', 'spill (memory / disk)', '637.5 MB / 196 MB'],
        ['I/O, small files', 'read tasks, input bytes', '63 tasks, 1.96 s vs 0.66 s'],
        ['scheduling', 'tasks vs work per task', '2,000 tasks of ~1 ms'],
      ],
    },
    {
      id: 'spill-code',
      kind: 'code',
      filename: 'spill.py — spark.driver.memory=1g',
      label: `# sort all 10,000,000 rows, AQE off
orders.orderBy("amount", "order_id") \\
      .write.format("noop").save()
# 1 partition:  22.0 s, one 20 s task
# 8 partitions:  8.1 s, tasks 1.9–2.4 s
# both spilled ~637 MB from memory`,
    },
  ],
  edges: [],
}
