import type { Section } from '../types'

export const dataLayout: Section = {
  id: 'data-layout',
  title: 'Improve data layout, file sizes, pruning and pushdown',
  scene: 'layout-pruning',
  focus: 'layout-table',
  slide: `## Layout, file sizes, pruning, pushdown

### Worked: one dataset, four layouts
- **Partitioned by date**, one day: **333,302** rows read instead of 10,000,000 — 0.12 s vs 0.31 s
- **Sorted by status**, \`CANCELLED\` only: **1,280,000** rows read instead of 10,000,000 — 0.16 s vs 0.31 s
- **2,000 small files**: 63 read tasks — **1.96 s** vs 0.66 s for 32 files

### Why it works
- \`PartitionFilters\` skip whole **directories**
- Pushed filters skip **row groups** whose min/max statistics rule them out — which only happens when values are **clustered**

### The misconception
"Pushdown is automatic, so layout does not matter." The same pushed filter read **10,000,000** rows unsorted and **1,280,000** sorted.`,
  narration:
    "Some of the biggest improvements come not from configuration but from how the data is laid out on disk. We wrote the same ten million orders four ways and queried each with the filter its layout was built for. Partitioned by sale date, a query for one day read three hundred and thirty three thousand rows instead of ten million, under one megabyte instead of twenty eight, and ran in twelve hundredths of a second instead of thirty one. The plan shows why. A partition filter skips every directory except the one for that day. In chapter five, a pushed filter on status read every single row. Here we sorted the data by status within each file before writing it, and the same filter for cancelled orders read only one point two eight million rows. Parquet's row groups record the minimum and maximum of each column, and once the data is clustered, whole row groups can be ruled out. File count matters too. The same data split into two thousand small files needed sixty three read tasks and took nearly two seconds, three times as long as thirty two well-sized files. Every file adds open and listing overhead. So the misconception to drop is that pushdown is automatic and layout does not matter. The pushed filter was identical in both cases. Unsorted, it read ten million rows. Sorted, it read one point two eight million. Layout decides what pushdown can skip.",
}
