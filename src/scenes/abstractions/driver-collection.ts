import type { Scene } from '@graphlearning/flow'

// §3.11 — the ways rows leave the cluster, bounded and unbounded, and a side effect performed inside
// tasks. `api.send` stands for any external call; it is illustrative, not a real client.
export const driverCollection: Scene = {
  id: 'driver-collection',
  title: 'Bringing results to the driver',
  flow: 'TB',
  nodes: [
    {
      id: 'collect-code',
      kind: 'code',
      filename: 'results.py',
      label: `daily.take(2)          # at most 2 rows
daily.collect()        # every row → driver
for row in daily.toLocalIterator():
    ...                # a partition at a time

def send(rows):        # runs inside each task
    for r in rows:
        api.send(r.asDict())   # repeats on retry
daily.foreachPartition(send)`,
    },
    {
      id: 'collection-rules',
      kind: 'list',
      framed: true,
      label: 'Keep results bounded',
      sub: 'and side effects repeatable',
      icon: 'shieldcheck',
      pattern: 'warn',
      items: [
        'Aggregate or limit before collecting',
        'spark.driver.maxResultSize: 1g by default',
        'Task retries repeat external calls',
        'Make external writes idempotent',
      ],
    },
  ],
  edges: [],
}
