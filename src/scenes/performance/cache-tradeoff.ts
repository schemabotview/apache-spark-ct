import type { Scene } from '@graphlearning/flow'

// §6.8 — two aggregations over the same filtered-and-joined data, recomputed versus cached. Times are
// medians of 3 on local[4]; storage level and size from df.storageLevel and the /storage API.
export const cacheTradeoff: Scene = {
  id: 'cache-tradeoff',
  title: 'Cache or recompute?',
  flow: 'TB',
  nodes: [
    {
      id: 'cache-code',
      kind: 'code',
      filename: 'cache.py',
      label: `e = (orders.where(F.col("status") == "COMPLETED")
     .join(stores, "store_id")
     .select("city", "sale_date", "amount"))
e.groupBy("city").agg(F.sum("amount")).collect()
e.groupBy("sale_date").agg(F.sum("amount")).collect()

e = e.cache()      # lazy: nothing stored yet
e.count()          # materialises it
e.storageLevel     # Disk Memory Deserialized 1x`,
    },
    {
      id: 'cache-table',
      kind: 'table',
      label: 'Two aggregations over e',
      sub: 'seconds',
      headers: ['', 'materialise', 'both actions', 'total'],
      values: [
        ['recompute each time', '—', '2.12', '2.12'],
        ['cached (89 MB in memory)', '2.25', '1.39', '3.64'],
      ],
    },
  ],
  edges: [{ source: 'cache-code', target: 'cache-table' }],
}
