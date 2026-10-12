import type { Section } from '../types'

export const schemaEnforcement: Section = {
  id: 'schema-enforcement',
  title: 'Schema enforcement and schema evolution',
  scene: 'schema-enforcement',
  focus: 'declared-type-table',
  slide: `## Schema enforcement and evolution

**Objective:** predict what a declared schema catches — and what it lets through.

### Enforcement: the declared type decides
- \`"12,50"\` into **DECIMAL(10,2)** → **1250.00**, no error: the comma is read as a thousands separator
- \`"12.505"\` → **12.51**, rounded; only \`"abc"\` is flagged corrupt
- Into **DOUBLE**, every quoted number is rejected

### Evolution: files that disagree
- Day 2 adds \`channel\`; the default read took **one file's** schema and missed it
- \`mergeSchema\` unions the columns; day 1 gets **NULL**
- \`union\` matches by **position**; \`unionByName\` by name

### The misconception
"A schema validates the data." It enforces **types**, not **meaning**.`,
  narration:
    "Chapter three assumed tidy data. This chapter takes it away, and every result you will see came from running Spark four point zero point one on deliberately messy records. Start with the promise people attach to schemas: declare the types and bad data gets caught. Look at the table. The same JSON values were read twice, once declaring amount as a decimal and once as a double. As a decimal, the quoted string twelve comma fifty became one thousand two hundred and fifty, with no error at all, because the reader treated the comma as a thousands separator. Twelve point five oh five was quietly rounded to twelve point five one. Only the word abc was flagged as corrupt. Declared as a double, every quoted number was rejected instead. So the declared type decides what gets caught, and neither choice caught the real problem: a European decimal comma that made one order a hundred times too large. Schemas also drift. On the second day, the producer added a channel column. A default Parquet read took the schema from one file and simply missed the new column. Merge schema unions the columns, and older rows get null. And when you combine DataFrames yourself, union matches columns by position and fails on a different count, while union by name matches them by name. The lesson: a schema enforces types. It does not check meaning.",
}
