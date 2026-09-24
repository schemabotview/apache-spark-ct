import type { Section } from '../types'

export const partitionedWrite: Section = {
  id: 'partitioned-write',
  title: 'Batch layer · Write the batch view',
  scene: 'cap-write',
  slide: `## Batch · Write the batch view

Write the rollup as the **accurate batch view** — shaped, partitioned, and written as a **Delta** table so downstream reads are fast and safe.

### What’s happening
- \`repartition("day")\` controls **how many files** per partition — dodges the small-files problem
- \`partitionBy("day")\` writes **one folder per day** → later reads prune by date
- **Delta** gives an **ACID** table with **time-travel** — a half-run can’t corrupt it; it’s Parquet underneath, so swap \`.format("parquet")\` for a plain lake
- This is the **source of truth** — accurate, but only as fresh as the last nightly run

**Exercises:** partitioned write · file layout / small-files · Delta · save modes`,
  narration:
    'The final batch step writes our rollup out as the batch view — the trusted, accurate table the serving layer will read. How we write it matters as much as what we write, and there are three decisions here. First, layout: we partition the output by day, which physically lays the data out as one folder per day, so any later read for a given date opens just that folder and prunes the rest — the same partition pruning we exploited on the way in, now built into our own output. Second, the number of files: we repartition by day so each day’s folder ends up with a sensible file count, which heads off the classic small-files problem, where thousands of tiny files cripple later reads. When you only want to reduce partitions without paying for a shuffle you’d reach for coalesce instead, and if this view were joined constantly you might even bucket it, pre-sorting the data so those joins skip the shuffle. Third, the format: we write it as a Delta table rather than plain Parquet. Delta layers an ACID transaction log over Parquet, so a half-finished nightly run can never leave the view in a corrupt state, and it gives us time-travel — we can query yesterday’s version if today’s looks wrong. Underneath it’s still columnar Parquet, so serving reads stay fast, and dropping to a plain Parquet lake is a one-word change to the format. Two more knobs round out any write: the save mode — overwrite here, but append to add to what’s already there, or ignore and errorIfExists to protect it — and the destination itself, because this one writer, exactly like the reader, targets many sinks through the same API: change the format and it writes ORC, JSON, or CSV files, a JDBC table, or streams the results out to Kafka. Now, step back and see what the batch layer gives us and what it doesn’t. It gives us numbers we can completely trust — a full, deduplicated, correctly aggregated view of history. But it has one built-in limitation: it’s only as fresh as the last time the nightly job ran. If it ran at 2 a.m., then by mid-afternoon it knows nothing about the last twelve hours of activity. For a dashboard that’s supposed to say revenue up to now, that staleness is a real gap. And filling that gap — covering what’s happened since the last batch run — is exactly the job of the speed layer, which we build next.',
}
