import type { Section } from '../types'

export const mapSideWrite: Section = {
  id: 'map-side-write',
  title: 'The map side writes files, not messages',
  scene: 'shuffle-map-write',
  focus: 'disk',
  slide: `## The map side writes files, not messages

The commonest wrong mental model: executors sending rows to each other. **Nothing is sent here.** Each task writes to its own local disk and stops.

### What one map task does
1. **Partition** — compute \`hash(key) % numPartitions\` for every row. That number is the row's destination.
2. **Buffer & sort** — accumulate records in memory, ordered by destination id
3. **Spill** — buffer full? Write a sorted run to disk, empty it, carry on
4. **Merge** — combine the spilled runs into the final output

### The output: two files. Per *task*.
| File | Holds |
|---|---|
| \`shuffle_0_2_0.data\` | all 200 destinations, concatenated in order |
| \`shuffle_0_2_0.index\` | the byte offsets — where destination *k* starts |

**Not** one file per reducer. 400 tasks × 200 reducers would be **80,000 files**; sort-based shuffle makes 800. They land under \`spark.local.dir\` — fast local disk matters here.`,
  narration:
    "Now let's zoom all the way in on a single map task, because this is where most people's mental model is wrong. When you picture a shuffle, you probably picture executors sending rows to each other over the network — a great flurry of machines talking. That is not what happens on this side. Nothing is sent. A map task writes files to its own local disk and then it's done. Here's the sequence. For every row it holds, the task computes a destination: take the hash of the key, modulo the number of shuffle partitions, and you get a number — say, somewhere between zero and one ninety-nine. That number is where the row needs to end up. The task doesn't send it there. It just tags it and keeps going. Those tagged records pile up in an in-memory buffer, sorted by destination. When the buffer fills, the task writes a sorted run out to disk, empties the buffer, and carries on — that's a spill, and you'll see it counted in the UI. At the end, it merges those spilled runs together. And here's the part worth remembering: it produces exactly two files. One data file, holding all two hundred destinations laid end to end in order, and one small index file recording where each destination starts and stops. Two files per task — not two files per reducer. That distinction is the reason this design is called sort-based shuffle and the reason it replaced the old one. Four hundred tasks writing separate files for two hundred reducers would be eighty thousand files. This way it's eight hundred. And they land under spark dot local dot dir, which is why fast local disk matters here more than almost anywhere else in Spark.",
}
