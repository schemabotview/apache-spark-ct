import type { Section } from '../types'

export const theCatalog: Section = {
  id: 'the-catalog',
  title: 'The catalog: the only thing that knows what a name means',
  scene: 'cat-catalog',
  focus: 'stats',
  slide: `## The catalog

The only thing in Spark that knows what a **name** means.

| Holds | Example |
|---|---|
| **Tables and views** | \`flights\` → parquet at \`s3://…\` |
| **Columns and types** | \`dest\` is a string, \`cnt\` is a bigint |
| **Functions** | built-ins, and your registered UDFs |
| **Statistics** | row counts and sizes — *if computed* |

### Where it comes from
- **The session** — temp views, \`createOrReplaceTempView\`. Dies with the session.
- **An external metastore** — Hive, Glue, Unity. Shared, durable, and how other tools see your tables.

### The row that decides your join strategy
**Statistics are optional.** If \`ANALYZE TABLE\` has never run, the optimizer is estimating sizes from compressed file bytes and heuristics.

\`\`\`sql
ANALYZE TABLE flights COMPUTE STATISTICS
\`\`\`

> Cheap to run, rarely run, and the most common reason a join strategy is wrong.`,
  narration:
    "To resolve a name, you need something that knows what names mean. That's the catalog, and it's a more interesting object than it sounds. It holds four things. Tables and views: the name flights maps to a location and a format — parquet files at this S3 path. Columns and their types: dest is a string, cnt is a bigint. Functions: every built-in, plus any user-defined function you've registered. And statistics: row counts, column sizes, distinct-value estimates. Where does it come from? Two places. There's a session-level catalog, which is where temporary views live — anything you create with createOrReplaceTempView is in here, and it dies when the session dies. And there's often an external metastore: Hive, AWS Glue, Databricks Unity Catalog. That one is shared and durable, which is how other tools and other people see the same tables you do. Now the fourth item, statistics, deserves special attention, because it's the one that quietly decides how your queries run. Statistics are optional. If nobody has ever run ANALYZE TABLE on your table, Spark doesn't know how many rows it has. It will estimate from the compressed file size on disk and some heuristics, and that estimate can be off by an order of magnitude — particularly with Parquet, which compresses extremely well. And that estimate is what the cost model uses to decide whether to broadcast a table. So: a missing statistic becomes a wrong size estimate, becomes a wrong join strategy, becomes a job that takes an hour instead of a minute. ANALYZE TABLE is cheap, it's rarely run, and it's the single most common root cause of a bad plan.",
}
