import type { Section } from '../types'

export const theOffsetLog: Section = {
  id: 'the-offset-log',
  title: 'The checkpoint, and why the order matters',
  scene: 'str-offset-log',
  focus: 'order',
  slide: `## The checkpoint

Not an optimisation. **The query's identity.** Delete it and you have a different query, with no memory of anything.

\`\`\`
checkpoint/
 ├── offsets/   what this batch WILL do  ← FIRST
 ├── commits/   what a batch DID do      ← after
 ├── state/     the running aggregates
 └── metadata   the query id
\`\`\`

### Write-ahead, and the **order** is the whole point
| On restart | Means |
|---|---|
| offset, **no** commit | it crashed → redo that batch |
| offset **and** commit | it finished → move on |

Replay, not guesswork. A restart reprocesses **exactly** the batch that was in flight.

> Two queries must never share a checkpoint, and changing your query can make an old one unreadable. It's part of the deployment.`,
  narration:
    "Fault tolerance in streaming rests on the checkpoint directory, and the most important thing to understand about it is that it isn't an optimisation. It's the query's identity. Delete it and you don't have the same query with a cleared cache — you have a different query that has never run and remembers nothing. Inside there are four things. An offsets directory, recording what each batch will process. A commits directory, recording what each batch did process. A state directory holding the running aggregates. And metadata with the query's id. Now here's the mechanism, and the order is the entire point. Before processing a batch, Spark writes the offset — the exact range of source data this batch covers. Then it does the work. Then it writes the commit. Write-ahead logging, and it makes a crash distinguishable from a completion. On restart, Spark looks at the last batch. If there's an offset but no commit, that batch was in flight when the process died, so it gets redone from the recorded offsets. If there's both an offset and a commit, it completed, and the next batch starts. That's replay, not guesswork, and it's why a restarted streaming job reprocesses exactly the batch it was working on rather than some approximate window of recent data. Two operational notes. Two queries must never share a checkpoint directory — they'll corrupt each other's view of progress. And changing your query can make an existing checkpoint unreadable, because the state format depends on the query shape. Treat the checkpoint as part of your deployment, not as a temporary file somewhere in slash tmp.",
}
