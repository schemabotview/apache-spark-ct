import type { Section } from '../types'

export const readLake: Section = {
  id: 'read-lake',
  title: 'Batch layer · Read the lake',
  scene: 'cap-read-lake',
  slide: `## Batch · Read the lake

We build the **accurate** layer first. The batch job reprocesses a full day from the data lake — starting by reading the raw events as **Parquet**, and reading only what it needs.

### What’s happening
- **Parquet** is columnar → only the **selected columns** are read (projection pushdown)
- The \`where\` is **pushed into the scan** (predicate pushdown) — non-purchases never load
- Reading one **date partition** (\`dt=…\`) skips the rest of the lake (partition pruning)

**Exercises:** data sources & formats · predicate/projection pushdown · partition pruning`,
  narration:
    'Let’s build the pipeline, and we start on the left, with the batch layer — the accurate, source-of-truth half. Its job is to reprocess an entire day of history from the data lake and produce numbers we can fully trust. It begins by reading the raw events, and they’re stored as Parquet, which matters a lot. Parquet is a columnar format, so when we select just the handful of columns we care about — the timestamp, the user, the product, the amount, the action — Spark physically reads only those columns off disk and skips the rest; that’s projection pushdown. The filter matters just as much: because Parquet carries statistics, our where-clause for purchase events gets pushed all the way down into the scan, so rows that don’t match are never even loaded into Spark. And because the lake is laid out in folders by date, pointing at a single day’s partition means Spark prunes away every other day without looking at it — partition pruning. Put together, those three — column pruning, predicate pushdown, and partition pruning — mean this read touches a tiny fraction of the lake even though conceptually we asked for the events. That’s the payoff of using a real columnar format and a partitioned layout, and it’s exactly the kind of thing the structured APIs and Catalyst do for you. It’s also worth seeing how general this reader is, because you’ll use it constantly: the very same call — spark dot read, then format, option, and load — reads Parquet, ORC, Avro, JSON, CSV, a JDBC database, or a Delta table, just by changing the format string. And options tune the read: you can hand it an explicit schema to skip inference, choose a parsing mode like permissive, dropMalformed, or failFast for messy input, or set things like header and multiLine for CSV and JSON. Parquet here needs almost none of that, which is part of why it’s the natural choice for a lake. We now have a lean DataFrame of the day’s purchase events; next we clean it up.',
}
