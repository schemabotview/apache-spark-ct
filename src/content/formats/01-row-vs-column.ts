import type { Section } from '../types'

export const rowVsColumn: Section = {
  id: 'row-vs-column',
  title: 'Row-wise vs columnar',
  scene: 'fmt-row-vs-column',
  focus: 'col',
  slide: `## Row-wise vs columnar

Same data. Different **order on disk.**

| | Stores | Built for |
|---|---|---|
| **Row-wise** | all of row 1, then row 2 | *"this one record, all of it"* |
| **Columnar** | all of column 1, then column 2 | *"these 3 columns, all 10B rows"* |

CSV, JSON, Avro and every OLTP database are row-wise. Parquet and ORC are columnar.

### Which shape matches an analytical query
Analytics reads **few columns of many rows** — the exact opposite of what a row layout is good at.

- **Skip 197 columns** — never read, not read-then-discarded
- **Compress better** — like values sit next to like values

> Neither is better. They're answers to different questions. Spark's questions are analytical.`,
  narration:
    "Before anything about Parquet specifically, the distinction it rests on. Take the same table and write it to disk two ways. Row-wise means you store all of row one — every column of it — then all of row two, then row three. That's CSV, that's JSON, that's Avro, and that's how essentially every transactional database stores things. Columnar means you store all the values of column one, then all the values of column two. Every destination, together. Then every count, together. That's Parquet and ORC. Now, neither is better in the abstract. They're answers to different questions. A row layout is built for: give me this one record, all of it. If you're an online store looking up order number fifty thousand, you want every field of that order and you want it in one read. A row layout gives you exactly that. A columnar layout is built for: give me these three columns, for all ten billion rows. And that's analytics. When you compute a sum by destination over a year of events, you touch two or three columns and every row. So the shape of your access pattern is precisely the opposite of what a row layout optimises for. Two things follow. You can skip the columns you don't want — genuinely skip, seek past them on disk, not read them and discard them. And you compress far better, because when like values sit next to like values, there's much more redundancy for a compressor to find. Spark's questions are analytical, which is why Parquet is the default answer.",
}
