import type { Section } from '../types'

export const updatesAndDeletes: Section = {
  id: 'updates-and-deletes',
  title: 'Updates and deletes on immutable files',
  scene: 'lake-updates',
  focus: 'cow',
  slide: `## Updates and deletes

Parquet files are **immutable**. So *"update one row"* can't mean what it says — the file has to be replaced.

### Copy-on-write — rewrite the whole file
Then \`add\` the new and \`remove\` the old in **one entry.**

**Fast to read** (nothing to reconcile) · **slow to write** (one row → one whole file).

### Merge-on-read — write the change beside it
Record the delete, or write the new version alongside, and let the **reader** reconcile.

**Fast to write** · **slower to read** (every read applies the deltas).

### Which to pick
Write-heavy (streaming upserts, GDPR deletes) → merge-on-read. Read-heavy → copy-on-write.

> \`MERGE\` is what makes a data lake feel like a database.`,
  narration:
    "Parquet files are immutable. You cannot change a byte inside one. So update one row cannot possibly mean what it says — the file containing that row has to be replaced. There are two strategies, and they're a clean trade. Copy-on-write does the obvious thing. Find the file containing the row, read it, write a new file with the change applied, and then in one log entry add the new file and remove the old one. Atomic, as always. The result is fast to read — the table is just Parquet files, nothing to reconcile — and slow to write, because changing one row means rewriting an entire file of maybe a hundred and twenty-eight megabytes. Merge-on-read does the opposite. Don't rewrite anything. Write a small record saying this row is deleted, or write the new version of the row alongside the old one, and let the reader reconcile them at query time. Fast to write, because nothing is rewritten. Slower to read, because every read has to apply the outstanding changes. Which to pick follows from your workload. Write-heavy — streaming upserts arriving constantly, or GDPR deletion requests — favours merge-on-read. Read-heavy — a table queried by a hundred analysts and updated nightly — favours copy-on-write. And periodic compaction converts merge-on-read state back into clean files. Either way, the thing that makes this matter is the MERGE statement: upsert this batch into that table, matching on a key. That one operation is what makes a data lake feel like a database, and it's what turns delete this user's data everywhere from a multi-week engineering project into a query you run on a Tuesday.",
}
