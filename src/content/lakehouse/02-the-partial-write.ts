import type { Section } from '../types'

export const thePartialWrite: Section = {
  id: 'the-partial-write',
  title: 'The partial write',
  scene: 'lake-partial-write',
  focus: 'worse',
  slide: `## The partial write

A job writes 200 files. Each task writes its own, independently. **There is no moment when they all become visible together.**

\`\`\`
140 written  →  the job dies  →  60 never written
\`\`\`

### A reader arriving now sees 140 files
A complete-*looking* table with 70% of the data. Nothing marks it as partial. Every query against it returns a confident, wrong answer.

### And the recovery is worse than the failure
| | |
|---|---|
| **Re-run** | appends a *second* copy of the first 140 → duplicates |
| **Clean up first** | by hand — and *which* files were this run's? |

You now need your own bookkeeping to answer a question the storage layer should have answered.

> \`overwrite\` mode isn't a fix — it deletes the old data *before* writing the new. Die in between and you have **neither**.`,
  narration:
    "Let's make the problem concrete, because in the abstract it sounds like a corner case and in practice it's Tuesday. Your job writes two hundred files. Each task writes its own file, independently, and finishes at its own time. There is no moment at which all two hundred become visible together — they appear one at a time as tasks complete. Now the job dies after a hundred and forty. Out of memory, a spot instance reclaimed, a malformed row four hours in. Whatever the cause, you now have a hundred and forty files sitting in the directory. Here's what makes it bad rather than merely annoying. A reader arriving now sees a directory with a hundred and forty Parquet files in it. Nothing marks them as incomplete. There's no flag, no manifest, no status. So a query runs happily and returns an answer based on seventy percent of the data, with complete confidence and no warning. A dashboard updates. Someone makes a decision. And the recovery is worse than the failure. If you simply re-run the job, it appends another copy of the first hundred and forty files, and now your table has duplicates. If you clean up first, you have to work out which files belonged to this run and which were already there — and nothing recorded that either. So you end up writing your own bookkeeping: a side table tracking which runs wrote which files. Which is the storage layer's job that you've been forced to do by hand. And one thing worth saying: overwrite mode is not the fix. It deletes the old data before writing the new. Die in between and you have neither.",
}
