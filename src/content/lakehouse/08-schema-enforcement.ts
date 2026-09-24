import type { Section } from '../types'

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
