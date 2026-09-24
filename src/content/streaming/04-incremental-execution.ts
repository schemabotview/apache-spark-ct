import type { Section } from '../types'

export const incrementalExecution: Section = {
  id: 'incremental-execution',
  title: 'Incremental execution, and the state it needs',
  scene: 'str-incremental',
  focus: 'cost',
  slide: `## Incremental execution

The model says: **recompute from all input, every batch.** Correct — and impossible. The input grows forever.

### So the engine keeps the running result
\`\`\`
state: dest → 1,204     (what the last batch left)
   +  17 new rows       (this batch's input)
   =  1,221             (and the state is updated)
\`\`\`

Same answer. Work proportional to **what arrived**, not to everything ever received.

### Which introduces the only genuinely new thing
**State** — something that must survive between batches, *and across restarts.*

That's the dividing line in this whole subject:

| | |
|---|---|
| **Stateless** — \`filter\`, \`select\`, \`withColumn\` | each row alone; nothing to keep |
| **Stateful** — \`groupBy\`, joins, dedup | needs memory of earlier rows |

> Stateless streaming is nearly free. Every hard problem in the rest of this course is a state problem.`,
  narration:
    "Now, how does the model become something that can actually run? The model says recompute from all input on every batch. That's correct and completely impossible — after a year, all input is a year of data, and you'd be reprocessing it every minute. So the engine keeps the running result instead. If you're counting events per destination, it holds a count per destination. When seventeen new rows arrive, it adds them to the existing counts. One thousand two hundred and four becomes one thousand two hundred and twenty-one. The answer is identical to what a full recomputation would give, but the work is proportional to what just arrived rather than to everything ever received. And that introduces the one genuinely new thing in streaming, which is state. Something that has to survive between batches, and — because jobs get restarted, deployed, and killed — across restarts too. State is the dividing line that organises this entire subject, and it's worth making explicit. Stateless operations look at each row on its own: filter, select, withColumn, casting, parsing JSON. Nothing needs to be remembered, so these are nearly free in streaming and behave exactly as they do in batch. Stateful operations need memory of earlier rows: aggregations, joins, deduplication, anything windowed. Those need state, and state needs to be bounded, durable, and eventually cleaned up. Every genuinely hard problem in the rest of this course — watermarks, output modes, stream-stream joins — is a state problem wearing a different hat.",
}
