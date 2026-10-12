import type { Section } from '../types'

export const outputModes: Section = {
  id: 'output-modes',
  title: 'Output modes and compatible query shapes',
  scene: 'output-modes',
  focus: 'modes-table',
  slide: `## Append, update, complete

**Objective:** match the output mode to the query and to what the sink can accept.

### Worked: the windowed query, file by file
- **Append:** nothing until a window is final — then 09:00 **135**, 09:10 **140**, once each
- **Update:** only the windows that changed — 09:00 went 80 → 105 → 135
- **Complete:** every window every time — and o9 was **counted**: 09:00 ended at **140** from 6 orders

### Compatible shapes
- Append: aggregations need a watermark, so rows are final
- Update: changed rows; the sink must overwrite by key
- Complete: aggregations only; **keeps all state**. File sink: append only

### The misconception
"Output mode is just formatting." It changes **when** rows appear, **which** late data counts, and how much state is kept.`,
  narration:
    "The output mode decides what a micro-batch sends to the sink. Run the same windowed query three ways and compare, file by file. In append mode, nothing appears for the first two files, because no window is final yet. After the third file, the nine o'clock window is written once, at one hundred and thirty five. After the fourth, the ten past window, at one hundred and forty. Each row is written once and never changes, which is what a file sink needs. In update mode, each batch sends only the windows that changed. The nine o'clock window appears three times, at eighty, one hundred and five and one hundred and thirty five, so the sink must be able to overwrite a row by its key, like a database table. In complete mode, every batch rewrites the whole result: one window, then two, three and four. Look at the last row. Complete mode counted order nine, which the other modes dropped, and the nine o'clock window ended at one hundred and forty from six orders. Complete mode must be able to reproduce the entire result, so it keeps all state, and the watermark cannot drop any of it. The compatibility rules follow from this. Append with an aggregation needs a watermark, so Spark knows when a row is final. Complete works only for aggregations. The file sink accepts append only. The misconception to drop is that output mode is a formatting choice. It changes when rows appear, which late events count, and how much state the query must keep forever.",
}
