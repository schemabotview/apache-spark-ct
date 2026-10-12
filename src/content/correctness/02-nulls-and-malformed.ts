import type { Section } from '../types'

export const nullsAndMalformed: Section = {
  id: 'nulls-and-malformed',
  title: 'NULL, malformed records and data-quality policies',
  scene: 'malformed-and-nulls',
  focus: 'parse-mode-code',
  slide: `## NULLs, malformed records, policies

### One truncated line, three parse modes
- **PERMISSIVE** (default): the line lands in \`_corrupt_record\`
- **DROPMALFORMED**: 10 rows — the line **silently vanishes**
- **FAILFAST**: the read fails with \`MALFORMED_RECORD_IN_PARSING\`

### NULL is not a value
- \`status != 'CANCELLED'\` keeps **8** of 10: o9's NULL status fails too
- \`amount > 20\` (6) + \`amount <= 20\` (3) = **9**, not 10
- \`count(amount)\` is 9, so \`avg\` divides by **9**

**Policy:** quarantine bad rows with a reason, count them, alert on the count.

### The misconception
"Bad records fail loudly." The default mode **keeps going**.`,
  narration:
    "Real event files contain records that cannot be parsed. Our file has eleven lines, and the last one is truncated mid-object. What happens depends on the parse mode. Permissive, the default, keeps going: the ten good lines parse, and the broken line is preserved as text in a corrupt record column. Drop malformed also returns ten rows, but the bad line simply disappears, with no trace that it ever existed. Fail fast stops the read with a malformed record error. None of these is right in general. What matters is choosing one deliberately. Then there are nulls, and they cause more wrong answers than broken lines do. Order nine has no status. Filter for status not equal to cancelled, and you get eight rows, not nine, because comparing null with anything gives null, and a filter only keeps rows where the condition is true. The null safe comparison, eq null safe, keeps all nine. The same logic splits the amounts. Six orders are above twenty, three are at or below it, and order eight, with no amount, is in neither group. Aggregates skip nulls too. Count of amount is nine, so the average divides by nine rather than ten. A good pipeline turns this into a policy: route bad rows to a quarantine table with a reason, count them on every run, and alert when the count moves. Because the default mode keeps going, silence does not mean the data was clean.",
}
