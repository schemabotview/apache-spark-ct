import type { Section } from '../types'

export const folderIsNotATable: Section = {
  id: 'a-folder-is-not-a-table',
  title: 'A folder of Parquet is not a table',
  scene: 'lake-folder-not-table',
  focus: 'missing',
  slide: `## A folder is not a table

A directory of Parquet files is **excellent at being read** — columnar, pruned, compressed, openable by anything.

That is the whole of what it's good at.

### What a table has that this doesn't
| | |
|---|---|
| **Atomic writes** | all of it, or none |
| **Isolation** | a reader never sees a half-write |
| **Schema enforcement** | a bad write is rejected |
| **History** | *what did this look like on Tuesday?* |

Every one of those is something a database gave you for free, and that you've quietly stopped having.

### And it's structural, not an oversight
Object storage has **no transactions.** Nobody is coordinating the writers. Spark deliberately owns no storage — and no owner means no guarantees.

> This course is about the smallest thing that fixes it: **write down which files count.**`,
  narration:
    "Let's finish the whole subject where it has to end, with the gap that everything else leaves open. You have a directory of Parquet files. It is genuinely excellent at one thing: being read. Columnar layout, statistics that let readers skip, good compression, and any tool in the ecosystem can open it without asking permission. That's real, and it's why this architecture won. It is also the entire list of what it's good at. Think about what a table gives you that a directory doesn't. Atomic writes — either all of your change lands or none of it does. Isolation — a reader never sees a half-finished write. Schema enforcement — a write with the wrong types is rejected rather than accepted. History — the ability to ask what this looked like on Tuesday. Every one of those is something a relational database gave you for free, without you ever thinking about it, and that you have quietly stopped having the moment you moved to files on object storage. And it's important to understand this is structural rather than an oversight. Object storage has no transactions. There is no coordinator, nothing that can say these five writes happen together or not at all. Spark, as we established right at the start, deliberately owns no storage — that omission is why it outlived Hadoop. But no owner means no guarantees. So the question this course answers is: what's the smallest thing you can add to a directory of Parquet files to get those four properties back? And the answer turns out to be surprisingly small. Write down which files count.",
}

export const thePartialWrite: Section = {
  id: 'the-partial-write',
  title: 'The partial write',
  scene: 'lake-partial-write',
  focus: 'worse',
  slide: `## The partial write

A job writes 200 files. Each task writes its own, independently. **There is no moment when they all become visible together.**

\`\`\`
140 written  →  the job dies  →  60 never written
\`\`\`

### A reader arriving now sees 140 files
A complete-*looking* table with 70% of the data. Nothing marks it as partial. Every query against it returns a confident, wrong answer.

### And the recovery is worse than the failure
| | |
|---|---|
| **Re-run** | appends a *second* copy of the first 140 → duplicates |
| **Clean up first** | by hand — and *which* files were this run's? |

You now need your own bookkeeping to answer a question the storage layer should have answered.

> \`overwrite\` mode isn't a fix — it deletes the old data *before* writing the new. Die in between and you have **neither**.`,
  narration:
    "Let's make the problem concrete, because in the abstract it sounds like a corner case and in practice it's Tuesday. Your job writes two hundred files. Each task writes its own file, independently, and finishes at its own time. There is no moment at which all two hundred become visible together — they appear one at a time as tasks complete. Now the job dies after a hundred and forty. Out of memory, a spot instance reclaimed, a malformed row four hours in. Whatever the cause, you now have a hundred and forty files sitting in the directory. Here's what makes it bad rather than merely annoying. A reader arriving now sees a directory with a hundred and forty Parquet files in it. Nothing marks them as incomplete. There's no flag, no manifest, no status. So a query runs happily and returns an answer based on seventy percent of the data, with complete confidence and no warning. A dashboard updates. Someone makes a decision. And the recovery is worse than the failure. If you simply re-run the job, it appends another copy of the first hundred and forty files, and now your table has duplicates. If you clean up first, you have to work out which files belonged to this run and which were already there — and nothing recorded that either. So you end up writing your own bookkeeping: a side table tracking which runs wrote which files. Which is the storage layer's job that you've been forced to do by hand. And one thing worth saying: overwrite mode is not the fix. It deletes the old data before writing the new. Die in between and you have neither.",
}

export const theListingProblem: Section = {
  id: 'the-listing-problem',
  title: 'Listing is not free',
  scene: 'lake-listing',
  focus: 'cost',
  slide: `## Listing is not free

A directory listing *feels* free. On object storage it isn't.

| | |
|---|---|
| **A filesystem** | a directory is a real structure |
| **Object storage** | a **flat keyspace**; slashes are a convention, and a "listing" is a paged API scan |

### So finding out what a table contains is itself expensive
- **1000 keys per call** — a million files is 1000 round trips
- **On the driver**, single-threaded, *before any executor is given work*
- Then **partition discovery** on top

Your cluster sits idle, fully paid for, while one thread asks S3 what exists.

### Which suggests the fix
**Stop asking storage what the table contains. Write it down.**

One small file listing the current files replaces a million API calls with a single read — and it can carry statistics too, so you can skip files without opening their footers.

> That's the whole idea. Everything else in this course is a consequence of it.`,
  narration:
    "There's a second problem, and it's the one that makes people's jobs slow rather than wrong. To read a table stored as a directory, something has to find out which files are in it. On a real filesystem that's cheap — a directory is an actual data structure and listing it is one operation. On object storage it isn't. S3 has no directories at all. It's a flat keyspace, and the slashes in your keys are purely a naming convention with no structure behind them. Listing a prefix means a paged API scan, returning about a thousand keys per call. So a table with a million files is a thousand sequential API round trips. And here's what makes it painful rather than merely slow: that happens on the driver, single-threaded, before a single executor is given anything to do. Your entire cluster sits idle, fully paid for, while one thread asks S3 what exists. On a partitioned table there's partition discovery on top of that. People see jobs where the first several minutes show no activity at all, and assume something is broken. Nothing is broken; Spark is still finding out what the table is. Now, that problem suggests its own fix, and it's the same fix as the previous section's. Stop asking storage what the table contains, and write it down instead. One small file that lists the current files replaces a million API calls with a single read. And once you're writing that file, you may as well put statistics in it too — so you can skip files without even opening their footers. That is the entire idea of this course. Everything else is a consequence.",
}

export const theTransactionLog: Section = {
  id: 'the-transaction-log',
  title: 'The transaction log',
  scene: 'lake-transaction-log',
  focus: 'definition',
  slide: `## The transaction log

**The data doesn't move.** Still Parquet, still readable by anything. What changes is that something now says *which files count.*

\`\`\`
events/
 ├── part-0000.parquet   ← exactly as before
 └── _delta_log/
       ├── 000.json
       └── 001.json
\`\`\`

### Each entry is an ordered record of **intent**
| | |
|---|---|
| \`add\` | this file is now part of the table |
| \`remove\` | this one no longer is |
| \`metadata\` | the schema, and the partitioning |

### So the table is defined by the **log**, not the directory
A file with no \`add\` entry is **invisible**, however real it is on disk.

> That inversion is what buys everything in the rest of this course.`,
  narration:
    "So here's the mechanism, and the thing I'd most like to land is how little it changes. The data does not move. Your files are still Parquet, still in the same directory, still readable by any tool that can read Parquet. Nothing is wrapped, converted, or locked into a proprietary format. What's added is a log — a subdirectory next to the data containing numbered JSON files. Each one is a transaction entry, and they're ordered: zero, one, two, and so on. And each entry is not data. It's a record of intent. It says: this file was added to the table. This file was removed from it. The schema is now this. The partitioning is this. So to know what the table contains, you read the log from the beginning and apply each entry in order, and what you end up with is the current set of files. Now here's the inversion, and it's the whole thing. The table is defined by the log, not by the directory. A Parquet file sitting in that directory with no add entry in the log is invisible — it is not part of the table, no matter how real it is on disk. And a file with a remove entry is gone from the table while still physically present. Which immediately solves the partial-write problem from two sections ago. Those hundred and forty orphan files from the failed job? No log entry was ever written for them, so they simply aren't in the table. Readers never see them. And it solves listing, because reading one log is far cheaper than scanning a million keys. Everything else in this course falls out of that single inversion.",
}

export const aCommit: Section = {
  id: 'a-commit',
  title: 'A commit is one atomic append',
  scene: 'lake-commit',
  focus: 'atomic',
  slide: `## A commit

Writing happens in **two phases**:

1. **Write the files** — minutes, and **invisible** to every reader
2. **Append one log entry** — the whole write becomes visible *at once*

The files can be written slowly and carelessly; until step 2 they aren't part of anything.

### Step 2 is the atomic moment
It reduces to one question: **can two writers both create \`003.json\`?**

| | |
|---|---|
| **One wins** | the entry exists → committed |
| **The other retries** | against the new version — *optimistic concurrency* |

Nobody waits. No locks.

### And a crash is now uninteresting
No entry was written, so the orphan files simply aren't in the table.`,
  narration:
    "Let's look at what a write actually does, because the two-phase structure is where all the safety comes from. Phase one: write the data files. This might take minutes. It might write two hundred files. And the entire time, none of it is visible to any reader, because no log entry references any of it. The files exist on disk and are not part of the table. Phase two: append one entry to the log, listing all those files as additions. And at that instant — the instant that single small file appears — the whole write becomes visible, atomically, all two hundred files at once. So the expensive, slow, failure-prone part is completely safe, because it doesn't count for anything until the cheap, fast part happens. That's a nice piece of design. It means the atomicity requirement collapses to one question: can two writers both create the file oh-oh-three dot json? If the storage system can guarantee only one succeeds, you have atomic commits. The loser doesn't block or wait — it re-reads the log, checks whether its change still makes sense given what just got committed, and tries again as oh-oh-four. That's optimistic concurrency control: assume conflicts are rare, detect them at commit time, retry. Nobody holds a lock, readers never block writers, and writers never block readers. And now a crash is completely uninteresting. The job dies after writing a hundred and forty files? No log entry was written. Those files are not in the table. Readers never saw them and never will. There's nothing to clean up for correctness — just some wasted storage, which the vacuum operation handles later.",
}

export const snapshotIsolation: Section = {
  id: 'snapshot-isolation',
  title: 'Snapshot isolation',
  scene: 'lake-snapshot',
  focus: 'why',
  slide: `## Snapshot isolation

A reader resolves the version **once**, at the start: read the log to version 7, take the set of files it describes, and use **that set** for the entire query.

Meanwhile a writer commits version 8 — adding files, removing others. **The running reader never sees any of it.**

### Which is what actually makes the table usable
| | |
|---|---|
| **A consistent answer** | never half of one version and half of another |
| **No locking** | readers never block a writer; writers never block readers |

### The practical effect
Writers stop needing *a window when nobody is reading* — the thing every nightly pipeline is scheduled around.

You can compact a table at 3pm while dashboards query it. You can rewrite a partition while a training job reads the old one.

> Both are true at once: the reader is right, and the writer is right. They're just looking at different versions, and both versions are valid tables.`,
  narration:
    "Once the table is defined by a log rather than a directory, something valuable falls out almost for free. A reader starts a query. The first thing it does is read the log and resolve the current version — say version seven. That gives it a specific set of files. And it uses that exact set for the entire query, however long the query runs. Now a writer commits version eight while that query is still running. New files added, some old ones removed. The running reader doesn't see any of it, because it isn't asking again — it resolved its file set at the start and it's working through that. So its answer is consistent: it reflects the table as of version seven, completely, with no part of version eight mixed in. That's snapshot isolation, and it's the same guarantee a serious database gives you, achieved with nothing more than an ordered log and immutable files. And notice there's no locking anywhere. Readers never block writers. Writers never block readers. Nobody waits for anybody. The practical effect is the one worth dwelling on, because it changes how you schedule work. Writers stop needing a window when nobody is reading — which is the thing every nightly pipeline in the world is scheduled around. You can compact a table at three in the afternoon while dashboards are querying it. You can rewrite a partition while a training job reads the old version. Both parties are right at the same time. They're just looking at different versions, and both of those versions are valid, complete, consistent tables.",
}

export const timeTravel: Section = {
  id: 'time-travel',
  title: 'Time travel is the same operation, stopped early',
  scene: 'lake-time-travel',
  focus: 'uses',
  slide: `## Time travel

Not a feature bolted on. **The same operation, stopped early.**

The log is an ordered list. Replaying it to the end gives today's table. Replaying to entry 5 gives the table as of version 5.

\`\`\`sql
SELECT * FROM events VERSION AS OF 5
SELECT * FROM events TIMESTAMP AS OF '2026-09-20'
\`\`\`

### What it's actually for
| | |
|---|---|
| **What changed?** | diff two versions, exactly |
| **Undo a bad write** | restore a previous version |
| **Reproduce a model** | train on the data *as it was* |

The first one pays for itself the first time a number changes and nobody knows why. Without it, that's archaeology. With it, it's a query.

### And it isn't free
Old versions exist because **their files were never deleted.** Retention is storage you're paying for — which is what §11 is about.

> The counterintuitive part: time travel isn't something that was added. It's something that was *never taken away*.`,
  narration:
    "Time travel sounds like an advanced feature and it's actually a consequence of the design that would have taken effort to prevent. The log is an ordered list of changes. To find the current table you replay it from the beginning to the end. So to find the table as it was at version five, you replay it from the beginning to entry five. Same operation, stopped early. There's no separate mechanism, no snapshot storage, no backup system. The information was always there. What is it actually for? Three things, and the first is the one that justifies the whole feature. What changed? When a number on a dashboard moves and nobody knows why, you can diff version twelve against version eleven and see exactly which rows changed. Without time travel that's archaeology — grep through logs, ask around, guess. With it, it's a query you run in thirty seconds. Second, undoing a bad write. A job runs with a bug and corrupts a table; you restore the previous version, which is a metadata operation rather than a restore from backup. Third, reproducibility: train a model on the data exactly as it was on a given date, which matters enormously for anything audited or regulated. And it isn't free. Old versions are readable because their files were never deleted — every version you can travel to is storage you're paying for. That's the tension the next section resolves. The counterintuitive framing I'd leave you with: time travel isn't something that was added to these formats. It's something that was never taken away.",
}

export const schemaEnforcement: Section = {
  id: 'schema-enforcement',
  title: 'Schema enforcement moves the failure to where it belongs',
  scene: 'lake-schema',
  focus: 'after',
  slide: `## Schema enforcement

### Without a log: whatever you write becomes the table
A column's type changes in an upstream system. The write **succeeds.** Weeks later, a query returns nulls, and the job that caused it ran twenty deploys ago.

### With a log: the schema is *in* it, and the write is checked
A mismatched write **fails, at write time, loudly** — unless you explicitly allow evolution.

That's the whole of what enforcement buys: **the failure moves to the moment it's caused.**

### And the log can hold more than a schema
| | |
|---|---|
| \`NOT NULL\` | enforced on every write |
| \`CHECK\` constraints | \`amount > 0\`, and it means it |

Those are the things people arrive for and didn't know they could have on a data lake.

> Evolution is still possible — \`mergeSchema\`, deliberately, per write. The difference is that it's now a **decision** rather than an accident.`,
  narration:
    "Schema enforcement is the feature that most changes how it feels to operate a data platform, and the reason is about when errors happen rather than whether they happen. Without a log, whatever you write becomes the table. Somebody upstream changes a column from an integer to a string — a perfectly ordinary change in a system you don't own. Your job writes the new files happily, because nothing is checking. Weeks later, someone runs a query and gets nulls in a column that should have numbers. Now you investigate. The job that caused it ran twenty deploys ago. The person who changed the upstream system has moved teams. You're doing archaeology, and the data in between is already wrong. With a log, the schema is recorded in it, and every write is checked against it. A mismatched write fails at write time, loudly, with an error naming the column and both types — unless you've explicitly asked for schema evolution. And that's the entire value: the failure moves to the moment it's caused. Same bug, but it surfaces where somebody can fix it in five minutes instead of five weeks. Once you have a place to record a schema, you can record more than a schema. NOT NULL constraints, enforced on every write. CHECK constraints — amount must be greater than zero — that actually reject violating rows. Those are the things people miss most when they move from a database to a data lake, and they didn't realise they could have them back. Evolution is still possible, by the way — you can merge a new schema deliberately, per write. The difference is that it's a decision rather than an accident.",
}

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

export const compaction: Section = {
  id: 'compaction',
  title: 'Compaction: the small-file problem, returning',
  scene: 'lake-compaction',
  focus: 'fix',
  slide: `## Compaction

The small-file problem, arriving **faster** — a log makes frequent writes *safe*, so people do them. Every streaming trigger and every \`MERGE\` adds files.

### Compaction is a normal commit with unusual content
\`\`\`
read 1000 small
  → write 10 large
  → one entry: add + remove
\`\`\`
Same rows. Atomic, like every other commit.

### And readers are undisturbed
A query already running stays on its old version — the old files aren't deleted, just removed from the current one.

So compaction stops being a maintenance window and becomes a background job.

> Some formats can **cluster** while compacting — sorting by a filter column so min/max stats tighten and readers skip more.`,
  narration:
    "The small-file problem comes back here, and it arrives faster than before, for an ironic reason. A transaction log makes frequent writes safe. Before, writing to a table every minute was dangerous — partial writes, readers seeing inconsistent states. Now it's safe, so people do it. And every one of those commits adds files. A streaming job writing every trigger produces files forever. Every MERGE operation rewrites files, producing more files. A table that's written to constantly accumulates small files at a genuinely impressive rate. The fix is compaction, and the elegant part is that it isn't a special operation. It's a normal commit with an unusual content. Read a thousand small files. Write ten large ones containing exactly the same rows. Then write one log entry that adds the ten and removes the thousand. Atomic, like every other commit, using the same mechanism. And because of snapshot isolation, readers are completely undisturbed. A query that's already running resolved its file set at the start and is still reading the old small files — which haven't been deleted, only removed from the current version. So compaction stops being a maintenance window that has to be scheduled at three in the morning when nobody's using the table, and becomes a background job you run whenever. That's a real operational change. There's a related operation worth knowing about. Some formats can cluster while compacting — sorting the rows by a column you commonly filter on as they're rewritten. That makes the min-max statistics in each file much tighter, so readers can skip far more files. It's the sortedness idea from the formats course, applied on a schedule instead of hoped for at write time.",
}

export const vacuum: Section = {
  id: 'vacuum',
  title: 'VACUUM: the only thing that deletes',
  scene: 'lake-vacuum',
  focus: 'danger',
  slide: `## \`VACUUM\`

**Nothing so far has deleted a byte.** \`remove\` takes a file out of the *table*, not off the *disk* — which is precisely what made time travel possible.

### \`VACUUM\` is the only thing that deletes
Files no live version references, older than a **retention threshold** — 7 days by default.

| | |
|---|---|
| **Within retention** | kept, so recent versions resolve |
| **Older** | deleted — and **those versions stop existing** |

### The one irreversible operation here
The default isn't timidity. Snapshot isolation means a **long-running reader** may still be using files the current version removed.

> The trade, plainly: **retention is storage cost; vacuuming is lost history.** No setting gives you both.`,
  narration:
    "Here's a thing that surprises people the first time they look at their storage bill. Nothing described so far has deleted a single byte. Remove entries take files out of the table. They don't take them off the disk. And that's not an oversight — it's exactly what makes time travel work. Version five is readable because version five's files are still there. So every rewrite, every merge, every compaction leaves the old files behind, and your storage grows steadily. Vacuum is the only operation that actually deletes. It finds files that no live version references and that are older than a retention threshold — seven days, by default — and removes them from storage. Everything within the retention window stays, so recent versions still resolve. Everything older goes, and those versions stop existing. And this is the one genuinely irreversible operation in the whole design. Everything else is a log entry you could undo. Deleting files is not. Now, why is the default seven days rather than something tighter? It isn't timidity. It's snapshot isolation. A query that started twenty minutes ago resolved its file set then, and it may still be reading files that the current version has removed. If you vacuum those away while it's running, that query fails. So the retention window is protecting readers that started before the vacuum did. Shorten it aggressively and you can break running queries and lose your ability to travel back. The trade, stated plainly: retention costs storage, and vacuuming costs history. There's no setting that gives you both, so pick deliberately based on how much you'd pay to be able to answer what did this look like last month.",
}

export const theThree: Section = {
  id: 'the-three',
  title: 'Delta, Iceberg, Hudi',
  scene: 'lake-the-three',
  focus: 'table',
  slide: `## Delta, Iceberg, Hudi

All three are **a log beside Parquet.** Everything in this course applies to all of them.

| | Metadata | Origin |
|---|---|---|
| **Delta** | a JSON log, checkpointed to Parquet | Databricks |
| **Iceberg** | a tree: snapshot → manifests → files | Netflix |
| **Hudi** | a timeline, with record-level indexes | Uber |

### The honest advice
**The mechanism matters. The choice rarely does.**

All three give atomic commits, snapshot isolation, time travel, schema enforcement and \`MERGE\`. The differences show at extremes most people never reach.

Pick what your platform supports, and spend the saved time on **layout** — that's where the order-of-magnitude wins are.

> Course 1 said no owner means no guarantees. This is the layer that gives them back.`,
  narration:
    "Let's close by naming the three implementations, and then being honest about how much the choice matters. Delta Lake came out of Databricks. Its metadata is a JSON log, periodically checkpointed into Parquet so you don't replay thousands of entries. It's the most tightly integrated with Spark and usually the default if you're on Databricks. Apache Iceberg came out of Netflix. Its metadata is a tree — a snapshot points to a manifest list, which points to manifests, which point to files. That indirection costs a little complexity and buys efficiency on genuinely enormous tables, and it was designed from the start for engine neutrality, so Trino, Flink and Spark are all first-class. Apache Hudi came out of Uber. Its metadata is a timeline with record-level indexes, and it was built around upserts and incremental pulls, which shows in how good it is at those. Now the honest advice, and I want to give it clearly because a lot of energy goes into this comparison. The mechanism matters enormously. The choice between them rarely does. All three give you atomic commits, snapshot isolation, time travel, schema enforcement, and MERGE. The differences emerge at extremes — tables with hundreds of thousands of partitions, or upsert rates measured per second. Most people are not at those extremes. So pick whichever your platform supports best, and spend the time you saved on layout: partitioning, file sizes, sortedness. That's where the order-of-magnitude wins actually are. And with that we've come full circle. Right at the start, we said Spark deliberately owns no storage, and that outliving Hadoop was the reward — but no owner means no guarantees. This is the layer that hands the guarantees back, without taking the openness away.",
}
