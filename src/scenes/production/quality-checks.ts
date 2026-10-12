import type { Scene } from '@graphlearning/flow'

// §8.5 — a unit test on a small DataFrame and the data-quality checks a production run applies,
// each tied to a Chapter 4 failure and the numbers it produced.
export const qualityChecks: Scene = {
  id: 'quality-checks',
  title: 'Tests and data-quality checks',
  flow: 'TB',
  nodes: [
    {
      id: 'test-code',
      kind: 'code',
      filename: 'test_daily_sales.py',
      label: `from pyspark.testing import assertDataFrameEqual

def test_join_keeps_order_count(spark):
    out = enrich(orders_df(spark), stores_df(spark))
    assert out.count() == 6
    assert out.select("order_id").distinct()\\
              .count() == 6

def test_daily_totals(spark):
    assertDataFrameEqual(daily(sample(spark)),
                         expected(spark))`,
    },
    {
      id: 'check-table',
      kind: 'table',
      label: 'Checks on every run',
      sub: 'and the Chapter 4 failure each catches',
      headers: ['check', 'failure it catches'],
      values: [
        ['rows out = rows in', 'duplicated store: 6 → 8'],
        ['order_id unique', 'resent o4 counted twice'],
        ['store known', 'o7 at store 15'],
        ['amount not NULL', 'o8, and "12,50"'],
        ['quarantined ≤ 1%', 'truncated lines'],
      ],
    },
  ],
  edges: [],
}
