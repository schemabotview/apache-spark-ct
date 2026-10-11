import type { Scene } from '@graphlearning/flow'

// §3.5 — column expressions built from F.col, operators, cast and when/otherwise, and the rows
// enriched.show() returned for the sample.
export const columnExpressions: Scene = {
  id: 'column-expressions',
  title: 'Columns and expressions',
  flow: 'TB',
  nodes: [
    {
      id: 'expression-code',
      kind: 'code',
      filename: 'enrich.py',
      label: `# a Column: an expression, no data yet
pence = (F.col("amount") * 100).cast("int")

enriched = (orders
    .withColumn("amount_pence", pence)
    .withColumn("is_done",
                F.col("status") == "COMPLETED")
    .withColumn("size",
                F.when(F.col("amount") >= 50, "large")
                 .otherwise("small")))`,
    },
    {
      id: 'enriched-rows',
      kind: 'table',
      label: 'enriched.show()',
      sub: 'selected columns',
      headers: ['order_id', 'amount', 'amount_pence', 'is_done', 'size'],
      values: [
        ['o1', '40.00', '4000', 'true', 'small'],
        ['o2', '25.00', '2500', 'true', 'small'],
        ['o3', '60.00', '6000', 'false', 'large'],
        ['o4', '15.00', '1500', 'true', 'small'],
        ['o5', '80.00', '8000', 'true', 'large'],
        ['o6', '10.00', '1000', 'false', 'small'],
      ],
    },
  ],
  edges: [{ source: 'expression-code', target: 'enriched-rows', label: 'show()' }],
}
