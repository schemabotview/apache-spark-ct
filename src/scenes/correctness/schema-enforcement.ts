import type { Scene } from '@graphlearning/flow'

// §4.1 — what a declared schema catches. The table is real PySpark 4.0.1 output for the same JSON
// values read as DECIMAL(10,2) and as DOUBLE ("corrupt" = NULL plus a _corrupt_record entry). The
// code card is the schema-evolution half: two Parquet days that disagree about a column.
export const schemaEnforcement: Scene = {
  id: 'schema-enforcement',
  title: 'What a schema catches',
  flow: 'TB',
  nodes: [
    {
      id: 'declared-type-table',
      kind: 'table',
      label: 'One JSON value, two declared types',
      sub: 'PERMISSIVE mode, Spark 4.0.1',
      headers: ['raw value', 'DECIMAL(10,2)', 'DOUBLE'],
      values: [
        ['"12,50"', '1250.00', 'corrupt'],
        ['"12.50"', '12.50', 'corrupt'],
        ['"12.505"', '12.51', 'corrupt'],
        ['"1,234.5"', '1234.50', 'corrupt'],
        ['"abc"', 'corrupt', 'corrupt'],
        ['12.5', '12.50', '12.5'],
      ],
    },
    {
      id: 'schema-evolution-code',
      kind: 'code',
      filename: 'evolution.py',
      label: `# day=1 has no channel column; day=2 adds it
spark.read.parquet("orders/").columns
# ['order_id', 'store_id', 'amount', 'day']

(spark.read.option("mergeSchema", True)
      .parquet("orders/")).columns
# [..., 'amount', 'channel', 'day']

d1.union(d2)
# [NUM_COLUMNS_MISMATCH] 3 columns vs 4
d1.unionByName(d2, allowMissingColumns=True)`,
    },
  ],
  edges: [],
}
