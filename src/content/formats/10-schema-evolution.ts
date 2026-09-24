import type { Section } from '../types'

export const schemaEvolution: Section = {
  id: 'schema-evolution',
  title: 'What you can change, and what you can\'t',
  scene: 'fmt-schema-evolution',
  focus: 'merge',
  slide: `## Schema evolution

Parquet matches columns **by name**, not position. That's what makes some changes safe.

### Safe
**Add a column** — old files read it as \`null\`. **Reorder** — position was never load-bearing.

### Not safe
| | |
|---|---|
| **Rename** | it's a *new* column; the old reads null |
| **Narrow a type** | \`long → int\` has nowhere to put the value |
| **Drop, re-add, new type** | worst — incompatible files, same name |

Widening (\`int → long\`) is usually fine. Narrowing never is.

### \`mergeSchema\` is off by default, rightly
It reads **every file's footer** to build a union — fine for ten files, ruinous for a million, and single-threaded on the driver.

> Parquet gives conventions, not enforcement. A table format gives enforcement.`,
  narration:
    "Data outlives the code that wrote it, so schemas change, and it's worth knowing which changes are survivable. The key fact underneath all of this: Parquet matches columns by name, not by position. That's why some changes are safe. Adding a column is safe. New files have it, old files don't, and when Spark reads a mix it fills in null for the files that predate it. Reordering columns is safe, because position was never what identified them. Now the unsafe ones. Renaming a column is not a rename as far as Parquet is concerned — it's a new column with a new name, and the old one has simply ceased to exist. Files written before the change have data under the old name, files after have it under the new one, and reading them together gives you two columns, each half null. Narrowing a type is unsafe for the obvious reason: if you change a long to an int, there's nowhere to put values that don't fit. Widening — int to long — is generally fine. And the worst case is dropping a column and later re-adding the same name with a different type, which gives you files that genuinely cannot be reconciled. There's an option called mergeSchema that handles some of this by reading every file's footer and building a union of all the schemas it finds. It's off by default, and it should be. For ten files it's fine. For a million it's catastrophic, and it's a driver-side single-threaded cost, so your cluster idles while it happens. The honest summary is that Parquet gives you conventions, not enforcement. If you want a schema that's actually checked at write time, that's what a table format provides.",
}
