import type { Scene } from '@graphlearning/flow'

// §8.8 — which guarantees a plain Parquet directory gives, which a table format adds, and where Spark
// itself stops: Spark plans and runs the work; the format's transaction log decides what is visible.
export const tableFormatBoundary: Scene = {
  id: 'table-format-boundary',
  title: 'Table formats and their boundary',
  flow: 'TB',
  nodes: [
    {
      id: 'merge-code',
      kind: 'code',
      filename: 'upsert.sql',
      label: `-- needs a table format; plain Parquet rejects it
MERGE INTO sales t
USING updates u ON t.order_id = u.order_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *`,
    },
    {
      id: 'guarantee-table',
      kind: 'table',
      label: 'Who supplies the guarantee',
      headers: ['guarantee', 'Parquet dir', 'table format'],
      values: [
        ['readers see a whole commit', 'no', 'yes: log'],
        ['concurrent writers', 'unsafe', 'conflict check'],
        ['MERGE, UPDATE, DELETE', 'no', 'yes'],
        ['read an older version', 'no', 'time travel'],
        ['planning and compute', 'Spark', 'Spark'],
      ],
    },
  ],
  edges: [],
}
