import type { Section } from '../types'

export const writingDatasets: Section = {
  id: 'writing-datasets',
  title: 'Writing datasets: formats, modes and output structure',
  scene: 'write-output',
  focus: 'write-tree',
  slide: `## What a write produces

### Save modes
- \`errorifexists\` (**default**): a second write raises \`PATH_ALREADY_EXISTS\`
- \`append\`, \`overwrite\`, \`ignore\`
- The 4.0.1 guide: modes use **no locking** and are **not atomic**

### Output structure
- A **directory**, not a file: one part file per writing task
- \`partitionBy("status")\` → \`status=COMPLETED/\` folders; the column moves into the **path**
- Parquet compresses with **snappy** by default; \`_SUCCESS\` marks a finished job

### The misconception
"Overwrite swaps old for new." Existing data is **deleted before** the new data is written — a failed job can leave neither.`,
  narration:
    "Writing looks like a single call, but it produces a structure you need to understand. The code writes the orders as Parquet, partitioned by status, in overwrite mode. On the right is the directory Spark four point zero point one created. It is a folder, not a file. Inside, there is one folder per status value, named status equals cancelled, completed and pending, and inside each a part file written by a task. Notice where the status column went. It is no longer inside the files. It moved into the folder names, and Spark puts it back as a column when the directory is read. The files are compressed with snappy, the default for Parquet, and the underscore success file is a marker that the job finished. Then the code tries to write to the same path again without a mode, and it fails with path already exists. That is the default mode, error if exists, and it is a safety net. The other modes are append, overwrite and ignore, which silently skips the write when data is already there. Now the important caveat, quoted from the documentation: save modes use no locking and are not atomic. Which leads to the misconception. Overwrite does not swap the old data for the new. It deletes the existing data first, then writes. If the job fails half way, you can be left with neither version.",
}
