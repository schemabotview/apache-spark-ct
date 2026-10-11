import type { Section } from '../types'

export const readingSources: Section = {
  id: 'reading-sources',
  title: 'Reading CSV, JSON, Parquet and JDBC',
  scene: 'reading-sources',
  focus: 'file-reads',
  slide: `## Reading files and databases

### What each format tells Spark
- **CSV:** \`header\` and \`inferSchema\` both default to **false** — every column a string, the header read as data
- **JSON:** types inferred from the values — \`amount\` becomes **double**
- **Parquet:** the schema is **stored in the files** — \`decimal(10,2)\` survives

### A database is a different kind of source
- Without partition options: **one query, one connection**
- With them: \`numPartitions\` queries against a **live** database
- \`lowerBound\` / \`upperBound\` set the **stride**; rows outside are still read

### The misconception
"Writing then reading gives back the same data." A JSON round trip turned **decimal(10,2)** into **double**.`,
  narration:
    "Every source tells Spark a different amount about types, and the differences show up in your results. Start with CSV, read with no options at all. Both header and infer schema default to false, so Spark returns four string columns named underscore c zero to underscore c three, and the header line becomes a row of data. We wrote the same orders out as JSON and read them back. JSON has no declared types, so Spark infers them from the values. Amount comes back as a double, and store id as a big integer. Read the Parquet copy, and the original types return exactly, decimal with two places and an integer, because Parquet stores the schema inside the files. That leads to a misconception worth testing yourself against. Writing data out and reading it back does not always return the same data. The JSON round trip silently turned an exact decimal into a floating point number. A database read through JDBC is a different kind of source altogether. By default it is a single query over a single connection, so one task does all the work. Add a partition column, bounds and a number of partitions, and Spark issues that many queries in parallel, each hitting the live database. Read the bounds carefully. They only decide how the key range is divided. They do not filter anything, so rows outside the bounds are still read, by the first and last partitions.",
}
