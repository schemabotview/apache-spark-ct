import type { Section } from '../types'

export const sinksAndIdempotence: Section = {
  id: 'sinks-and-idempotence',
  title: 'Exactly-once needs the sink\'s cooperation',
  scene: 'str-sinks',
  focus: 'three',
  slide: `## Exactly-once

Needs **three** things. Spark provides two.

| | |
|---|---|
| **A replayable source** | Kafka, files — ask again by offset |
| **Deterministic computation** | same input, same output |
| **An idempotent sink** | writing twice = writing once |

That third one is **not Spark's to give.**

### Because a retried batch really does write twice
Replay gives you *at-least-once* delivery. The sink is what turns it into exactly-once — or doesn't.

### How a sink can manage it
- **File sink** — a manifest of committed files; uncommitted ones are ignored
- **A transactional table** — one atomic commit per batch
- **\`foreachBatch\` + \`MERGE\`** — upsert on a key, using the batch id

> \`foreachBatch\` is the escape hatch for any sink without native support: you get a normal DataFrame and a batch id, and you make the write idempotent yourself. If you ignore the batch id, you have at-least-once and should say so.`,
  narration:
    "Exactly-once processing is the guarantee everyone wants, and it's worth being precise about what it requires, because Spark cannot deliver it alone. Three things are needed. A replayable source — one you can ask again for a specific range, by offset. Kafka is replayable. A file source is replayable. A socket is not. Deterministic computation, so that replaying the same input produces the same output. And an idempotent sink: writing the same data twice must have the same effect as writing it once. Spark provides the first two. The third is not Spark's to give. And the reason this matters is that a retried batch genuinely does write twice. Replay gives you at-least-once delivery: if a batch fails after writing some output but before committing, the retry writes that output again. What turns at-least-once into exactly-once is the sink refusing to double-count. Three ways a sink can manage it. The file sink keeps a manifest of committed files, so files from a failed attempt are simply ignored by readers. A transactional table format commits each batch atomically — either the whole batch is visible or none of it is. And foreachBatch lets you do it yourself: you receive a normal DataFrame and a batch id, and you write with a MERGE keyed on something unique, so a repeat is a no-op. That last one is the escape hatch for any sink without native support — a relational database, an API, anything. And the honest note: if you use foreachBatch and ignore the batch id, you have at-least-once, not exactly-once. That's often fine. It should just be a decision rather than an accident.",
}
