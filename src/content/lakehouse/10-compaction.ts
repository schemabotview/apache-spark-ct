import type { Section } from '../types'

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
