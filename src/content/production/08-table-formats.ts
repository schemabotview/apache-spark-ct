import type { Section } from '../types'

export const tableFormats: Section = {
  id: 'table-formats',
  title: 'Data-lake table formats: operational role and boundaries of Spark versus external guarantees',
  scene: 'table-format-boundary',
  focus: 'guarantee-table',
  slide: `## Table formats and their boundary

**Model:** Spark plans and runs the work. A **table format** — Delta Lake, Apache Iceberg, Apache Hudi — keeps a transaction log that decides which files form the table.

### A plain Parquet directory
- The table is whatever files are in the folder: a reader during an overwrite can see **missing or mixed** files
- Concurrent writers unsafe; no \`MERGE\`, no history

### What a table format adds
- **Atomic commits:** readers see the old snapshot or the new one; writer conflict checks
- \`MERGE\`, \`UPDATE\`, \`DELETE\`, time travel

### Worked: the o2 update
Plain Parquet: rewrite the whole day's partition. Table format: one \`MERGE\` on \`order_id\`.

### The misconception
"Spark gives ACID tables." Spark supplies the compute and the SQL; the **format's log** supplies the guarantee.`,
  narration:
    "So far our outputs have been plain Parquet directories, and it is worth being precise about what they guarantee. In a plain directory, the table is simply whatever files are in the folder. A reader that lists the folder during an overwrite can see some old files missing and some new ones not yet written. Two jobs writing at once can leave a mixture. There is no way to update one row, and no history to go back to. Table formats such as Delta Lake, Apache Iceberg and Apache Hudi add a transaction log beside the data files. A commit is recorded in the log in one step, so a reader sees either the previous snapshot or the new one, never half of each. Concurrent writers are checked for conflicts. Row level MERGE, UPDATE and DELETE become possible, and older versions can be read again, which is called time travel. Take the update to order two from Chapter 4, which changed its status after it was written. With plain Parquet, the job must rewrite the whole day's partition. With a table format, one MERGE on order id updates that row. Notice where the boundary sits. Spark parses the MERGE statement, plans it and runs it on executors. The guarantee that readers see a whole commit comes from the format's log and its library, installed as a connector. The misconception to drop is that Spark gives you ACID tables. Spark supplies the compute and the SQL. The table format supplies the transaction guarantee, and its documentation, not Spark's, defines its limits.",
}
