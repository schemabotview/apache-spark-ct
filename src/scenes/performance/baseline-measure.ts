import type { Scene } from '@graphlearning/flow'

// §6.1 — how the chapter measures: warm up, take the median of repeated runs, and carry a checksum
// that must not change. Numbers are from PySpark 4.0.1, local[4] (4 cores, 15 GB), 10,000,000 orders.
export const baselineMeasure: Scene = {
  id: 'baseline-measure',
  title: 'A baseline you can trust',
  flow: 'TB',
  nodes: [
    {
      id: 'baseline-code',
      kind: 'code',
      filename: 'baseline.py',
      label: `def q():
    return (orders
            .where(F.col("status") == "COMPLETED")
            .join(stores, "store_id").groupBy("city")
            .agg(F.count("*").alias("orders"),
                 F.sum("amount").alias("sales")))

q().collect()                    # warm-up, discarded
times = [timed(q) for _ in range(3)]
statistics.median(times)

# checksum: must match before and after a change
(len(r), sum(r.orders), sum(r.sales))`,
    },
    {
      id: 'baseline-table',
      kind: 'table',
      label: 'The daily summary, 10,000,000 orders',
      sub: 'local[4], seconds',
      headers: ['run', 'seconds', 'note'],
      values: [
        ['first (cold)', '3.86', 'JVM, listing, codegen'],
        ['warm 1', '1.26', ''],
        ['warm 2', '1.07', ''],
        ['warm 3', '1.21', 'median 1.21'],
        ['checksum', '—', '50 · 8,000,464 · 368,061,489.09'],
      ],
    },
  ],
  edges: [{ source: 'baseline-code', target: 'baseline-table' }],
}
