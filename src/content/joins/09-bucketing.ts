import type { Section } from '../types'

export const bucketingSection: Section = {
  id: 'bucketing',
  title: 'Bucketing: pay the shuffle once',
  scene: 'joins-bucketing',
  focus: 'conditions',
  slide: `## Bucketing: pay the shuffle once

Not a way to *avoid* a shuffle. A way to **move it in time** — out of every daily run, into one write.

\`\`\`
.bucketBy(320, "customer_id")
.sortBy("customer_id")
.saveAsTable("orders_bucketed")
\`\`\`

The table is now stored already partitioned by the join key. Every future join on that key shuffles **neither** side — no \`Exchange\` in the plan at all.

### The conditions — all of them, or nothing
| | |
|---|---|
| **Same column** | on both tables |
| **Same bucket count** | or a multiple, on Spark 3.1+ |
| **A managed table** | \`saveAsTable\`, not a bare path |

Miss one and you get **no error, no warning, and no benefit** — just the shuffle you thought you'd removed. Always confirm with \`explain()\`.

### When it's worth it
A table joined **the same way, repeatedly**. A fact table against a dimension, every night. One-off analysis: never.`,
  narration:
    "Bucketing gets described as a way to avoid a shuffle, and that's not quite right. It's a way to move a shuffle in time. Think about a nightly pipeline that joins orders to customers on customer id. Every night, both tables get shuffled by customer id. Monday, Tuesday, Wednesday — the same data, hashed the same way, moved across the same network, every single run. Bucketing says: do that once, at write time, and store the result. When you write a table with bucketBy on customer id, Spark hashes each row and writes it into the bucket its key belongs to, so the file layout on disk already reflects the partitioning a join would need. Then every future join on that column shuffles neither side. Not the small side, not the big side. There's no Exchange in the plan at all. That's a bigger saving than anything else in this course. The catch is that the conditions are strict and failing them is silent. Both tables must be bucketed on the same column. They must have the same number of buckets — or on Spark three point one and later, counts that are multiples of each other, which Spark can coalesce. And it has to be a managed table, written with saveAsTable, because the bucketing information lives in the metastore, not in the files. Miss any of those and you get no error and no warning. You just get the shuffle back, silently, and a pipeline that's slower than you believe it is. So always confirm with explain. And be clear about when this earns its complexity: a table joined the same way over and over. For one-off analysis it's never worth it.",
}
