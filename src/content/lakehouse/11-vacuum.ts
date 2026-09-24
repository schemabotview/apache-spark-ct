import type { Section } from '../types'

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
