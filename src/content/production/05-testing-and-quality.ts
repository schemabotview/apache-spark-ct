import type { Section } from '../types'

export const testingAndQuality: Section = {
  id: 'testing-and-quality',
  title: 'Testing and data-quality checks explained through failure cases',
  scene: 'quality-checks',
  focus: 'check-table',
  slide: `## Tests and data-quality checks

**Model:** **tests** check the code on data you chose; **quality checks** check each run on data you did not.

### Unit tests
- pytest, a local \`SparkSession\` fixture, tiny DataFrames, \`assertDataFrameEqual\`
- Write each from a failure: the join must keep **6 orders as 6 rows**

### Worked: checks on every run, from Chapter 4
- Rows out = rows in: a duplicated store turned **6 orders into 8 rows**
- Unique \`order_id\`: the resent o4 would be counted twice
- Known store: o7 at store 15 has no city
- Amount present: o8, and \`"12,50"\` failing to cast
- Quarantine under a threshold: truncated lines

### The misconception
"The tests pass, so the output is right." Tests cover the cases you **imagined**; checks catch what the data actually did today.`,
  narration:
    "Testing a pipeline needs two different tools, and Chapter 4 gives us the failures to aim them at. Unit tests check the code against data you chose. In pytest, a fixture starts one local Spark session, and each test builds a tiny DataFrame. PySpark's testing module provides assert DataFrame equal, which compares rows and schemas and reports the difference. The best tests come straight from failures. Remember the store table that listed store seven twice: the join turned six orders into eight rows, and the sales total rose to match. So one test says: after enrichment, six orders are still six rows and six distinct order ids. Data quality checks are different. They run inside every production run, on data nobody chose. Rows out must equal rows in for a lookup join, which catches the duplicated store. Order id must be unique after deduplication, which catches the resent order four. Every store must be known, which flags order seven at store fifteen. Amounts must be present, which flags order eight, and the amount written with a comma that failed to cast. And the quarantined share of malformed lines must stay under a threshold, which catches the truncated line before it becomes a thousand. When a check fails, the run stops before publishing, and the alert names the check. The misconception to drop is that passing tests mean the output is right. Tests cover the cases you imagined. Quality checks catch what the data actually did today.",
}
