import type { Section } from '../types'

export const rddsAndLineage: Section = {
  id: 'rdds-and-lineage',
  title: 'RDDs, lineage, transformations and actions',
  scene: 'rdd-lineage',
  focus: 'rdd-debug-string',
  slide: `## RDDs and lineage

**Objective:** read RDD code and its lineage, and say what runs when.

An **RDD** is an immutable, partitioned collection of objects, with a record of **how it was built**.

### On the six-order sample
- \`first()\` and \`count()\` are actions; \`filter\` and \`map\` are not
- \`count()\` returns **4**: o1, o2, o4, o5 are completed
- The file was read as **2** partitions

### Reading the lineage
- Bottom to top: file → lines → one **PythonRDD**
- Consecutive Python steps are **fused** into one PythonRDD

### The misconception
Lineage is not a copy of your code, line by line. It is the dependency chain Spark would **replay** to rebuild a lost partition.`,
  narration:
    "This chapter moves from how Spark runs to what you write, and it starts with the oldest abstraction, the RDD, short for resilient distributed dataset. An RDD is an immutable collection of objects, split into partitions, that remembers how it was built. That memory is its lineage. Every example in this chapter uses the same six order sample, and every result you see was produced by Spark four point zero point one. The code reads the CSV file as lines, takes the first line as the header, drops it, splits each line on commas, and keeps the completed orders. First and count are actions. The filters and the map are transformations, so they only extend the lineage. Count returns four, because orders one, two, four and five are completed, and the file was read as two partitions. Now look at the lineage Spark printed. Read it from the bottom: a Hadoop RDD that reads the file, a mapped RDD of lines, and then a single Python RDD. Three separate Python steps in the code became one entry, because PySpark fuses consecutive Python functions so each record crosses into Python once. That is the misconception to drop. Lineage is not a transcript of your code. It is the dependency chain Spark would replay to rebuild a lost partition, exactly the recovery mechanism from the previous chapter.",
}
