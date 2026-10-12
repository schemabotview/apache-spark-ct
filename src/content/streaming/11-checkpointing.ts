import type { Section } from '../types'

export const checkpointing: Section = {
  id: 'checkpointing',
  title: 'Checkpointing, restart behaviour, and compatible query changes',
  scene: 'checkpoint-restart',
  focus: 'checkpoint-tree',
  slide: `## Checkpoints and restarts

**Model:** the checkpoint is the query's memory — offsets planned, batches committed, source log and state.

### Worked: restart after two batches
- \`offsets/0–1\` written **first**; \`commits/0–1\`: both finished
- \`offsets/1\` holds \`{"logOffset":1}\` — files up to index 1 are read
- Restart: the next run is **batch 2**, reading only the 2 new rows
- An offset with no commit is **re-run** with the same range

### Changes between restarts
- Add or remove a filter: **allowed**
- Add a source or change its type: **not allowed**
- New file-sink path, new grouping keys or aggregates: **not allowed**

### The misconception
"The checkpoint is a backup I can reuse for a new query." It belongs to **one** query shape.`,
  narration:
    "The checkpoint directory is the query's memory, and it is what makes a restart continue instead of starting over. Look inside one after two batches. Offsets zero and one record what each batch was meant to read; they are written first, before the batch runs. Commits zero and one record that both batches finished. The sources folder holds the file source's log of files read, the state folder holds the store totals, and metadata holds the query id. Offsets one contains log offset one: the files up to index one have been taken. Now restart the query with the same checkpoint location. Spark reads the last offset and the last commit, sees that batch one finished, and starts batch two, reading only the two new rows of the third file. If the crash had come between writing offsets one and writing commits one, Spark would re-run batch one with exactly the same range. That replay is safe only if the sink tolerates it, which is the next section. A checkpoint also fixes the query's shape. The guide lists which changes are allowed between restarts. Adding or removing a filter is fine. Adding a source, or changing its type, is not. Pointing a file sink at a new path is not. Changing the grouping keys or aggregates is not, because the saved state no longer matches the new schema. The misconception to drop is that a checkpoint is a backup you can reuse for a new query. It belongs to one query shape. For an incompatible change, start a new checkpoint and plan how to backfill.",
}
