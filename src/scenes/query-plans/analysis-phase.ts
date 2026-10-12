import type { Scene } from '@graphlearning/flow'

// §5.2 — analysis on real 4.0.1 output: the parsed and analyzed heads of the plan (expression ids
// removed), a name that does not resolve, and the cast analysis inserts for a string literal.
export const analysisPhase: Scene = {
  id: 'analysis-phase',
  title: 'Analysis: names, types, expressions',
  flow: 'TB',
  nodes: [
    {
      id: 'parsed-vs-analyzed',
      kind: 'code',
      filename: 'explain("extended") — trimmed',
      label: `== Parsed Logical Plan ==
'Aggregate ['city], ['city, 'count(*) AS orders,
            'sum('amount) AS sales]

== Analyzed Logical Plan ==
city: string, orders: bigint, sales: decimal(20,2)
Aggregate [city], [city, count(1) AS orders,
                   sum(amount) AS sales]`,
    },
    {
      id: 'analysis-cases',
      kind: 'code',
      filename: 'analysis.py',
      label: `orders.select("amout")      # fails right here
# [UNRESOLVED_COLUMN.WITH_SUGGESTION] \`amout\`
#   ... Did you mean ... [\`amount\`, ...]

orders.where("store_id = '7'")
# analyzed: Filter (cast(store_id as bigint)
#                   = cast(7 as bigint))

orders.select(F.col("status") + 1).collect()
# [CAST_INVALID_INPUT] 'COMPLETED' ... "BIGINT"`,
    },
  ],
  edges: [],
}
