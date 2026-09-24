import type { Section } from '../types'

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
