import type { Section } from '../types'

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
