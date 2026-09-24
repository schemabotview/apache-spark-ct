import type { Section } from '../types'

export const theFooter: Section = {
  id: 'the-footer',
  title: 'The footer: read the end first',
  scene: 'fmt-footer',
  focus: 'holds',
  slide: `## The footer

A Parquet reader starts at the **end** of the file. The last 8 bytes give the footer length and a magic number; it seeks back and reads the footer first.

### What the footer holds
| | |
|---|---|
| **The schema** | names, types, nesting |
| **Offsets** | where each column chunk begins |
| **min / max per chunk** | *everything in §5 rests on this* |
| **Null counts** | and distinct counts, sometimes |

Everything needed to decide **what not to read** — available before a single byte of data is touched.

### Which is why a Parquet file isn't streamable
You can't read it front to back. The map is at the end, so a **truncated file is unreadable**, not partly readable.

That's a real operational property: a job killed mid-write leaves a file nothing can open. It's one of the reasons table formats exist.

> Small files hurt partly because **every one costs a footer read** — metadata outweighing data.`,
  narration:
    "Here's a detail that seems like trivia and turns out to explain several behaviours: a Parquet reader starts at the end of the file. The last few bytes contain the footer length and a magic number. The reader seeks there, learns how big the footer is, seeks back, and reads the footer before touching any data. The footer is the map. It holds the schema — column names, types, and any nesting. It holds offsets, so the reader knows exactly which byte range each column chunk occupies. It holds statistics for every column chunk: the minimum value, the maximum value, and how many nulls. Sometimes distinct counts too. So before reading a single row, the reader knows the shape of the data and quite a lot about its contents. That's what makes everything in the next few sections possible. Now, two consequences. The first is operational: a Parquet file is not streamable. You cannot read it progressively from the front, because the map is at the back. Which means a truncated file isn't partly readable — it's unreadable. If a job dies halfway through writing, you get a file nothing can open. That's a genuine problem in practice and one of the reasons table formats like Delta and Iceberg exist. The second consequence is about small files, and it's worth flagging now because it comes back later. Every file costs a footer read. That's a seek and a read before any useful work. With a million tiny files you're doing a million of those, and the metadata genuinely outweighs the data.",
}
