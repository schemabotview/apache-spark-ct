import type { Section } from '../types'

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
