import type { Section } from '../types'

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
