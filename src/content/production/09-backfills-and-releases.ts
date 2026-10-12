import type { Section } from '../types'

export const backfillsAndReleases: Section = {
  id: 'backfills-and-releases',
  title: 'Backfills, schema changes, dependency compatibility, and safe releases',
  scene: 'backfill-overwrite',
  focus: 'overwrite-table',
  slide: `## Backfills and safe releases

**Objective:** change code, data or dependencies without damaging the history already published.

### Worked: rerunning one day
- \`sales/\` holds **365** date partitions; we overwrite 2026-10-01
- Default \`partitionOverwriteMode\` **static**: the whole table is replaced — **1 partition left**
- **dynamic**: only partitions in the DataFrame are replaced — **365 kept**

### Schema and dependencies
- Add a nullable column: old files read NULL. Change a type: rewrite or add a column
- Java 17/21, Scala 2.13, Python 3.9+; connector JARs must match **both** Spark and Scala

### The misconception
"A backfill is just running the job for old dates." Without per-date idempotent overwrites, it can **erase** what it was meant to repair.`,
  narration:
    "Production pipelines change: new code, new columns, new library versions, and backfills that recompute history. Each needs a way to change without damaging what is already published. Start with the most common accident. The sales table holds three hundred and sixty five daily partitions, and we rerun one day to fix it. The writer uses overwrite mode, partitioned by sale date. With the default partition overwrite mode, called static, an overwrite replaces the entire table, so after the rerun one partition is left and three hundred and sixty four days are gone. Setting the mode to dynamic replaces only the partitions present in the DataFrame, and all three hundred and sixty five remain. With dynamic overwrites, rerunning any day is idempotent, which is exactly what a backfill needs: run it day by day, and rerun any day that fails. Schema changes have their own rules. Adding a nullable column is safe: older files simply read it as null. Changing a column's type is not; it needs a rewrite or a new column. Dependencies too. Spark four point zero point one needs Java seventeen or twenty one, Scala two point thirteen, and Python three point nine or later, and a connector JAR must match both the Spark and the Scala version. Finally, release safely: run the new version on yesterday's input into a scratch path, compare row counts and checksums with production, then switch, keeping the old version ready. The misconception to drop is that a backfill is just running the job for old dates. Without idempotent per-date overwrites, it can erase what it was meant to repair.",
}
