import type { Scene } from '@graphlearning/flow'

// §4.2 — the eleven-line events file (one truncated line, o8 without an amount, o9 without a
// status) under the three parse modes, then NULL comparisons and aggregates. All counts are real
// 4.0.1 output; the 1530.00 sum includes o10's "12,50" read as 1250.00 (§4.1).
export const malformedAndNulls: Scene = {
  id: 'malformed-and-nulls',
  title: 'Malformed records and NULLs',
  flow: 'TB',
  nodes: [
    {
      id: 'parse-mode-code',
      kind: 'code',
      filename: 'read_events.py',
      label: `raw = spark.read.schema(SCHEMA).json("events.jsonl")
# PERMISSIVE:    10 rows + 1 in _corrupt_record
# DROPMALFORMED: 10 rows, the bad line gone
# FAILFAST:      [MALFORMED_RECORD_IN_PARSING]

good.where(F.col("status") != "CANCELLED")
# 8 rows: o9's NULL status is dropped too
good.where(~F.col("status").eqNullSafe("CANCELLED"))
# 9 rows`,
    },
    {
      id: 'null-aggregates',
      kind: 'table',
      label: 'Aggregates skip NULL',
      sub: '10 parsed rows, o8 has no amount',
      headers: ['count(*)', 'count(amount)', 'sum(amount)', 'avg(amount)'],
      values: [['10', '9', '1530.00', '170.000000']],
    },
  ],
  edges: [{ source: 'parse-mode-code', target: 'null-aggregates' }],
}
