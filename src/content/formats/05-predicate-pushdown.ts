import type { Section } from '../types'

export const predicatePushdown: Section = {
  id: 'predicate-pushdown',
  title: 'Predicate pushdown, and why sortedness pays',
  scene: 'fmt-predicate-pushdown',
  focus: 'sorted',
  slide: `## Predicate pushdown

\`\`\`sql
WHERE cnt > 5000
\`\`\`

Pushed to the reader, which answers it from **statistics alone**:

| Row group | max \`cnt\` | |
|---|---|---|
| 1 | 400 | **skipped** — nothing can match |
| 2 | 120 | **skipped** |
| 3 | 9000 | read it — something might |

Two of three row groups are never opened. No rows decoded, no bytes transferred.

### Which is why sortedness is worth money
Statistics only exclude a group when its range is **narrow**.

| | |
|---|---|
| **Unsorted** | every group spans 0…9999 → **nothing skips** |
| **Sorted on the filter column** | each group is a tight range → most skip |

Sorting on the column you filter by is one of the highest-leverage things you can do at write time — and almost nobody does it.

> Also: \`IS NOT NULL\` pushes down too, using null counts.`,
  narration:
    "Predicate pushdown is where the footer statistics earn their place. Suppose your query has a filter: count greater than five thousand. Spark pushes that condition down into the Parquet reader. And the reader can now answer a useful question without reading any data at all: for each row group, the footer records the maximum value of count. If a row group's maximum is four hundred, then no row in that group can possibly have a count above five thousand. Skip it. Don't open it, don't decode it, don't transfer it. Three row groups, two of them excluded on the strength of a number in the footer. Now here's the part that's worth more than the mechanism, and it's underused. Statistics only let you skip a group when that group's range is narrow. Think about what happens with unsorted data. Your counts range from zero to ten thousand, randomly distributed. Every row group will contain some small values and some large ones, so every row group's min is near zero and every max is near ten thousand. The statistics are technically correct and completely useless — nothing can be excluded, because every group might contain a match. Now sort the data by count before writing it. Suddenly row group one holds zero to four hundred, group two holds four hundred to twelve hundred, and so on. Each group has a tight range, and a filter excludes most of them immediately. Same data, same format, same query — and the difference between reading everything and reading five percent. Sorting on the column you filter by is one of the highest-leverage write-time decisions available, and almost nobody does it.",
}
