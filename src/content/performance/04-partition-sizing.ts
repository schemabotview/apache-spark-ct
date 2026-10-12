import type { Section } from '../types'

export const partitionSizing: Section = {
  id: 'partition-sizing',
  title: 'Choose partition sizes and parallelism',
  scene: 'partition-sizing',
  focus: 'sweep-table',
  slide: `## Partition sizes and parallelism

### Worked sweep, AQE off
- 1,500 groups after the shuffle: **4** partitions fastest at **0.65 s**
- The default **200**: 1.31 s · **2,000**: 3.93 s — tiny tasks, mostly overhead
- But sorting all 10M rows: **1** partition 22.0 s vs **8** at 8.1 s

### Sizing rules
- Enough tasks to keep **every core busy**, several waves at most
- Input splits up to 128 MB (\`spark.sql.files.maxPartitionBytes\`)
- AQE coalesces shuffle output toward 64 MB (\`advisoryPartitionSizeInBytes\`) — here it picked **1** task, 0.77 s

### The misconception
"More partitions means more parallelism, so it is faster." Past one task per core, extra partitions only add **overhead**.`,
  narration:
    "Partition count sets how work is divided, and there is no single right number. It depends on how much data each task receives. We ran the same aggregation, ten million orders grouped into fifteen hundred store and day combinations, at four different shuffle partition counts with adaptive execution switched off. Four partitions was fastest, at sixty five hundredths of a second. The default of two hundred took one point three one seconds, and two thousand took almost four. After the shuffle there were only fifteen hundred small groups, so most of those tasks had almost nothing to do and paid only scheduling overhead. Now the opposite case. Sorting all ten million rows moves the whole dataset through the shuffle, and there, one partition took twenty two seconds while eight took eight. Too few partitions forces a few tasks to carry everything. So size partitions by data, not by habit. You want enough tasks to keep every core busy, ideally in a few waves. Spark already splits input files at up to one hundred and twenty eight megabytes. And for shuffle output, adaptive execution coalesces small partitions toward an advisory size of sixty four megabytes. With it switched on, this aggregation used a single task and took seventy seven hundredths of a second, without any manual tuning. The misconception to drop: more partitions does not automatically mean faster. Beyond one task per core, extra partitions add overhead.",
}
