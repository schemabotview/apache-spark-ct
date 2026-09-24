import type { Section } from '../types'

export const theListingProblem: Section = {
  id: 'the-listing-problem',
  title: 'Listing is not free',
  scene: 'lake-listing',
  focus: 'cost',
  slide: `## Listing is not free

A directory listing *feels* free. On object storage it isn't.

| | |
|---|---|
| **A filesystem** | a directory is a real structure |
| **Object storage** | a **flat keyspace**; slashes are a convention, and a "listing" is a paged API scan |

### So finding out what a table contains is itself expensive
- **1000 keys per call** — a million files is 1000 round trips
- **On the driver**, single-threaded, *before any executor is given work*
- Then **partition discovery** on top

Your cluster sits idle, fully paid for, while one thread asks S3 what exists.

### Which suggests the fix
**Stop asking storage what the table contains. Write it down.**

One small file listing the current files replaces a million API calls with a single read — and it can carry statistics too, so you can skip files without opening their footers.

> That's the whole idea. Everything else in this course is a consequence of it.`,
  narration:
    "There's a second problem, and it's the one that makes people's jobs slow rather than wrong. To read a table stored as a directory, something has to find out which files are in it. On a real filesystem that's cheap — a directory is an actual data structure and listing it is one operation. On object storage it isn't. S3 has no directories at all. It's a flat keyspace, and the slashes in your keys are purely a naming convention with no structure behind them. Listing a prefix means a paged API scan, returning about a thousand keys per call. So a table with a million files is a thousand sequential API round trips. And here's what makes it painful rather than merely slow: that happens on the driver, single-threaded, before a single executor is given anything to do. Your entire cluster sits idle, fully paid for, while one thread asks S3 what exists. On a partitioned table there's partition discovery on top of that. People see jobs where the first several minutes show no activity at all, and assume something is broken. Nothing is broken; Spark is still finding out what the table is. Now, that problem suggests its own fix, and it's the same fix as the previous section's. Stop asking storage what the table contains, and write it down instead. One small file that lists the current files replaces a million API calls with a single read. And once you're writing that file, you may as well put statistics in it too — so you can skip files without even opening their footers. That is the entire idea of this course. Everything else is a consequence.",
}
