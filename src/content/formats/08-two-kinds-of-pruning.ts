import type { Section } from '../types'

export const twoKindsOfPruning: Section = {
  id: 'two-kinds-of-pruning',
  title: 'Four things the reader gets to skip',
  scene: 'fmt-two-prunings',
  focus: 'ladder',
  slide: `## Four things the reader skips

Coarsest first. **Each rung is cheaper than the one below**, because it's decided with less read.

| | Skips | Decided from |
|---|---|---|
| **1** | whole directories | the **path** alone |
| **2** | whole files | the footer — no data read |
| **3** | row groups | min/max in the footer |
| **4** | pages | the page index, if present |

### And only then, what's left
The filter finally runs **on rows** — on whatever survived all four.

### Which reframes what "Parquet is fast" means
Parquet isn't fast because it reads quickly. It's fast because of **everything it gets to not read.**

Every one of those four rungs is a decision made from metadata. That's the whole design — and it's why a format with no metadata (§11) can't do any of it.

> Layout is what makes rungs 1 and 3 work: partitioning feeds the first, sortedness feeds the third.`,
  narration:
    "Let's put the skipping in one place, because seeing the ladder is more useful than any individual rung. There are four things a Parquet reader can skip, and they get coarser as you go up. Rung one: whole directories, decided from the path alone. Partition pruning. Nothing is opened. Rung two: whole files, decided from the footer — the reader opens the footer, sees that this file's statistics rule out every row, and closes it without reading data. Rung three: row groups within a file, from the min and max statistics. Rung four: individual pages within a column chunk, using the page index, which newer Parquet versions carry. And only after all four does the filter actually run on rows — on whatever survived. Now here's the reframing I'd like to leave you with. Parquet is not fast because it reads quickly. Snappy-compressed columnar data is not dramatically faster to read, byte for byte, than anything else. Parquet is fast because of everything it gets to not read. Every rung on that ladder is a decision made from metadata, arrived at before the corresponding data is touched. And that tells you where your leverage is. Rungs two and four are automatic — the format handles them. Rungs one and three depend on choices you make at write time. Partitioning feeds rung one; if you partition on nothing, you never skip a directory. Sortedness feeds rung three; if your data is randomly ordered, your statistics are useless and you never skip a row group. So layout is not a detail. Layout is what determines how much of the ladder you actually get.",
}
