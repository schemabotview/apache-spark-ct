import type { Scene } from '@graphlearning/flow'

// §3.4 — the same CSV read twice: without a schema every column is a string; with one, types are
// declared up front. The table is the sample exactly as orders.show() printed it.
export const dataframeSchema: Scene = {
  id: 'dataframe-schema',
  title: 'DataFrames and explicit schemas',
  flow: 'TB',
  nodes: [
    {
      id: 'schema-code',
      kind: 'code',
      filename: 'read_orders.py',
      label: `raw = (spark.read.option("header", True)
       .csv("orders.csv"))
raw.dtypes          # every column: 'string'

SCHEMA = ("order_id STRING, store_id INT, "
          "amount DECIMAL(10,2), status STRING")
orders = (spark.read.option("header", True)
          .schema(SCHEMA).csv("orders.csv"))
orders.printSchema()`,
    },
    {
      id: 'schema-results',
      label: 'What Spark returns',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'schema-output',
          kind: 'code',
          filename: 'printSchema()',
          label: `root
 |-- order_id: string (nullable = true)
 |-- store_id: integer (nullable = true)
 |-- amount: decimal(10,2) (nullable = true)
 |-- status: string (nullable = true)`,
        },
        {
          id: 'orders-sample',
          kind: 'table',
          label: 'orders',
          sub: 'the sample, 6 rows',
          headers: ['order_id', 'store_id', 'amount', 'status'],
          values: [
            ['o1', '7', '40.00', 'COMPLETED'],
            ['o2', '7', '25.00', 'COMPLETED'],
            ['o3', '9', '60.00', 'CANCELLED'],
            ['o4', '9', '15.00', 'COMPLETED'],
            ['o5', '12', '80.00', 'COMPLETED'],
            ['o6', '7', '10.00', 'PENDING'],
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'schema-code', target: 'schema-results' }],
}
