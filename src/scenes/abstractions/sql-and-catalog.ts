import type { Scene } from '@graphlearning/flow'

// §3.7 — SQL over a temporary view, which compiles to the same optimized plan as the DataFrame
// version (verified on 4.0.1 with expression ids stripped), and the three kinds of named object a
// session can see.
export const sqlAndCatalog: Scene = {
  id: 'sql-and-catalog',
  title: 'Spark SQL and the catalog',
  flow: 'TB',
  nodes: [
    {
      id: 'sql-code',
      kind: 'code',
      filename: 'daily_sql.py',
      label: `# a name for a plan; no data is copied
orders.createOrReplaceTempView("orders")

spark.sql("""
    SELECT store_id, SUM(amount) AS sales
    FROM orders WHERE status = 'COMPLETED'
    GROUP BY store_id
""")   # same plan as the DataFrame version

daily.write.saveAsTable("daily_sales")
spark.catalog.listTables()
# daily_sales  MANAGED in spark_catalog.default
# orders       TEMPORARY`,
    },
    {
      id: 'catalog-objects',
      label: 'Named objects',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'temp-view', label: 'Temp view', sub: 'this session only', pattern: 'service', icon: 'search' },
        { id: 'global-temp-view', label: 'Global temp view', sub: 'global_temp, whole app', pattern: 'network', icon: 'globe' },
        { id: 'managed-table', label: 'Managed table', sub: 'catalog entry and files', pattern: 'storage', icon: 'table' },
      ],
    },
  ],
  edges: [{ source: 'sql-code', target: 'catalog-objects' }],
}
