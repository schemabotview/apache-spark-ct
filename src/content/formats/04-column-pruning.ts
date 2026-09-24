import type { Section } from '../types'

export const columnPruning: Section = {
  id: 'column-pruning',
  title: 'Column pruning',
  scene: 'fmt-column-pruning',
  focus: 'reads',
  slide: `## Column pruning

\`\`\`sql
SELECT dest, cnt FROM events
\`\`\`

The plan names exactly two attributes. The footer's offsets point straight at those two chunks.

| | |
|---|---|
| chunk: \`dest\` | **read** |
| chunk: \`cnt\` | **read** |
| 198 other chunks | **never touched** |
| bytes read | **~1%** |

Not read-and-discarded. **Seeked past.** The bytes never leave the disk.

### Which is the real cost of \`SELECT *\`
It isn't verbosity or style. It's a **100× increase in bytes read** on a wide table.

And it's silent — the query works, returns the right answer, and costs a hundred times what it needed to.

> Check it: \`ReadSchema\` in \`explain()\` lists what will actually be read. If it names 200 columns, something is forcing a full read.`,
  narration:
    "Column pruning is the simplest of the optimisations and often the largest. You write a query selecting two columns. The plan carries exactly two attributes. Spark hands the reader a list of two column names, the reader looks up their offsets in the footer, seeks directly to those byte ranges, and reads them. The other hundred and ninety-eight chunks are never touched. And I want to be precise about that, because people hear it as a filter. It's not. Those bytes are not read into memory and then discarded — they are never read. The disk head, or the object storage range request, skips over them entirely. If your two columns are one percent of the file's bytes, you transfer one percent of the file. Now, the practical consequence, and it's the most actionable thing in this course. SELECT star disables this completely. You've told Spark you need all two hundred columns, so it reads all two hundred. And the failure is silent — the query runs, it returns exactly the right answer, and it costs a hundred times what it needed to. Nothing warns you, because nothing is wrong. It's just expensive. This is why the advice to avoid SELECT star in production code isn't stylistic pedantry. In a row-based database it genuinely is mostly style. In a columnar format it's a hundredfold difference in I/O. And you can verify it in ten seconds: run explain and look at ReadSchema on the scan node. It lists what will actually be read. If it names two hundred columns when your query mentions three, something upstream is forcing a full read, and that's worth chasing.",
}
