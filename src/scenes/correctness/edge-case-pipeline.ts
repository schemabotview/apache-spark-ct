import type { Scene } from '@graphlearning/flow'

// §4.9 — the chapter's edge cases in one stream of nine events: a truncated line, a resent duplicate,
// a PENDING→COMPLETED update, a missing amount, an unknown store, and a 23:30 UTC sale. The daily
// table is real 4.0.1 output with the session time zone set to Europe/London.
export const edgeCasePipeline: Scene = {
  id: 'edge-case-pipeline',
  title: 'Nine events, one correct total',
  flow: 'TB',
  nodes: [
    {
      id: 'edge-pipeline-code',
      kind: 'code',
      filename: 'daily_sales_safe.py',
      label: `raw = spark.read.schema(SCHEMA).json("stream/")
bad = raw.where(F.col("_corrupt_record").isNotNull())

w = (Window.partitionBy("order_id")
           .orderBy(F.desc("event_time")))
ok = raw.where(F.col("_corrupt_record").isNull())
latest = (ok
          .withColumn("rn", F.row_number().over(w))
          .where("rn = 1"))

done = latest.where((F.col("status") == "COMPLETED")
                    & F.col("amount").isNotNull())
daily = (done.join(stores, "store_id", "left")
    .withColumn("sale_date", F.to_date("event_time"))
    .groupBy("sale_date", "store_id", "city")
    .agg(F.count("*").alias("orders"),
         F.sum("amount").alias("sales")))`,
    },
    {
      id: 'edge-results',
      label: 'Results and invariants',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'edge-daily',
          kind: 'table',
          label: 'daily sales, Europe/London',
          headers: ['sale_date', 'store_id', 'city', 'orders', 'sales'],
          values: [
            ['2026-10-01', '7', 'Leeds', '2', '65.00'],
            ['2026-10-01', '12', 'Hull', '1', '80.00'],
            ['2026-10-01', '15', 'NULL', '1', '30.00'],
            ['2026-10-02', '9', 'York', '1', '15.00'],
          ],
        },
        {
          id: 'edge-invariants',
          kind: 'list',
          framed: true,
          label: 'Invariants that held',
          sub: '9 events in',
          icon: 'circlecheck',
          pattern: 'service',
          items: [
            '1 quarantined + 8 parsed = 9',
            '8 parsed → 6 unique orders',
            '5 completed with an amount: 190.00',
            'o8 (no amount), o7 (store 15) flagged',
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'edge-pipeline-code', target: 'edge-results' }],
}
