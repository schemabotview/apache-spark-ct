import type { Section } from '../types'

export const folderIsNotATable: Section = {
  id: 'a-folder-is-not-a-table',
  title: 'A folder of Parquet is not a table',
  scene: 'lake-folder-not-table',
  focus: 'missing',
  slide: `## A folder is not a table

A directory of Parquet files is **excellent at being read** — columnar, pruned, compressed, openable by anything.

That is the whole of what it's good at.

### What a table has that this doesn't
| | |
|---|---|
| **Atomic writes** | all of it, or none |
| **Isolation** | a reader never sees a half-write |
| **Schema enforcement** | a bad write is rejected |
| **History** | *what did this look like on Tuesday?* |

Every one of those is something a database gave you for free, and that you've quietly stopped having.

### And it's structural, not an oversight
Object storage has **no transactions.** Nobody is coordinating the writers. Spark deliberately owns no storage — and no owner means no guarantees.

> This course is about the smallest thing that fixes it: **write down which files count.**`,
  narration:
    "Let's finish the whole subject where it has to end, with the gap that everything else leaves open. You have a directory of Parquet files. It is genuinely excellent at one thing: being read. Columnar layout, statistics that let readers skip, good compression, and any tool in the ecosystem can open it without asking permission. That's real, and it's why this architecture won. It is also the entire list of what it's good at. Think about what a table gives you that a directory doesn't. Atomic writes — either all of your change lands or none of it does. Isolation — a reader never sees a half-finished write. Schema enforcement — a write with the wrong types is rejected rather than accepted. History — the ability to ask what this looked like on Tuesday. Every one of those is something a relational database gave you for free, without you ever thinking about it, and that you have quietly stopped having the moment you moved to files on object storage. And it's important to understand this is structural rather than an oversight. Object storage has no transactions. There is no coordinator, nothing that can say these five writes happen together or not at all. Spark, as we established right at the start, deliberately owns no storage — that omission is why it outlived Hadoop. But no owner means no guarantees. So the question this course answers is: what's the smallest thing you can add to a directory of Parquet files to get those four properties back? And the answer turns out to be surprisingly small. Write down which files count.",
}
