import type { Section } from '../types'

export const sparkSqlAndCatalog: Section = {
  id: 'spark-sql-and-catalog',
  title: 'Spark SQL, temporary views, tables and the catalog',
  scene: 'sql-and-catalog',
  focus: 'catalog-objects',
  slide: `## Spark SQL and the catalog

\`spark.sql(...)\` returns a DataFrame. SQL and DataFrame code go through the **same analyser and optimizer**.

### Worked check
The SQL query and the DataFrame version produce the **identical optimized plan** on 4.0.1.

### Named objects
- **Temp view:** a name for a plan, this **session** only
- **Global temp view:** in \`global_temp\`, for the **application**
- **Table:** a **catalog** entry plus data; a managed table's files live in the warehouse directory

### Where table metadata lives
A plain session uses an **in-memory** catalog. Tables outlive the application only with a **persistent metastore**.

### The misconception
"SQL is faster (or slower) than DataFrames." Same plan, same execution.`,
  narration:
    "Spark SQL is not a separate engine bolted on the side. Calling spark dot sql with a query string returns an ordinary DataFrame, and the query passes through the same analyser and optimizer as DataFrame code. We checked that directly. The SQL query on the left and the DataFrame version from the previous section produce the identical optimized plan in Spark four point zero point one, once the internal expression numbers are set aside. So choose between them for readability, not speed. To query a DataFrame by name, you register it. Create or replace temp view gives the plan a name in this session, and copies no data at all. When the session ends, the name is gone. A global temporary view lives in a special database called global temp and lasts for the whole application. A table is different again: it is an entry in the catalog that points at data. Save as table writes the data and registers it, and the catalog listing shows daily sales as a managed table and orders as temporary. Managed means Spark owns the files, which live under the warehouse directory. One honest caveat. A plain Spark session uses an in-memory catalog, which our run reported. The files survive a restart, but the table entry does not. Tables outlive the application only when the session is connected to a persistent metastore.",
}
