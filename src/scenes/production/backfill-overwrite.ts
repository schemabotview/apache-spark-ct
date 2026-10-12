import type { Scene } from '@graphlearning/flow'

// §8.9 — rerunning one day into a date-partitioned table. With the default static overwrite mode the
// write replaces the whole table; dynamic mode replaces only the partitions the DataFrame contains.
export const backfillOverwrite: Scene = {
  id: 'backfill-overwrite',
  title: 'Backfills and overwrite modes',
  flow: 'TB',
  nodes: [
    {
      id: 'backfill-code',
      kind: 'code',
      filename: 'rerun_one_day.py',
      label: `day = build_daily(spark, "2026-10-01")
spark.conf.set(
    "spark.sql.sources.partitionOverwriteMode",
    "dynamic")    # default: static
(day.write.mode("overwrite")
    .partitionBy("sale_date")
    .parquet("sales/"))`,
    },
    {
      id: 'overwrite-table',
      kind: 'table',
      label: 'sales/ held 365 days before the rerun',
      headers: ['mode', 'partitions after', 'lost'],
      values: [
        ['static (default)', '1', '364 days'],
        ['dynamic', '365', 'none'],
      ],
    },
    {
      id: 'release-steps',
      kind: 'list',
      framed: true,
      label: 'A safe release',
      sub: 'new code, same input',
      icon: 'shieldcheck',
      pattern: 'service',
      items: [
        'Run the new version on yesterday to a scratch path',
        'Compare row count and checksum with production',
        'Switch the schedule, keep the old version to roll back',
        'Backfill by date, one idempotent overwrite per day',
      ],
    },
  ],
  edges: [
    { source: 'backfill-code', target: 'overwrite-table' },
    { source: 'overwrite-table', target: 'release-steps' },
  ],
}
