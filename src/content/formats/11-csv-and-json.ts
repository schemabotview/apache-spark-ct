import type { Section } from '../types'

export const csvAndJson: Section = {
  id: 'csv-and-json',
  title: 'Why CSV and JSON can\'t do any of this',
  scene: 'fmt-csv-json',
  focus: 'do',
  slide: `## CSV and JSON

Every optimisation in this course rested on **metadata**. A text format has none of it.

| | |
|---|---|
| **No schema** | everything is text until parsed |
| **No statistics** | nothing to skip on |
| **No column layout** | no pruning possible |
| **No footer** | read it, or don't |

### And \`inferSchema\` costs a whole extra pass
Spark reads the data **once to guess types**, then again to load it. On a large file that's double the I/O before any work.

\`\`\`python
spark.read.schema(my_schema).csv(path)   # one pass
\`\`\`

### So: declare the schema, and convert once
CSV and JSON are **interchange** formats. Fine at the edge of a system — how data arrives, how it leaves. Wrong as a place to *keep* data.

Read it once, write Parquet, and every query after that gets the whole ladder from §8.

> A guessed schema is also a *wrong* schema eventually — one file with an odd value and your id column becomes a string.`,
  narration:
    "Let's finish by looking at what happens without any of this, because it makes the case better than praising Parquet does. Take a CSV. What does it have? No schema — everything is text until something parses it, so there's no way to know that column three is an integer without reading it. No statistics, so there is nothing to skip on; a filter has to examine every row. No column layout, so column pruning is impossible — the columns are interleaved on every line, and to get past one you have to read it. And no footer, no index, no map of any kind. You read the file or you don't. So every optimisation we've discussed simply doesn't apply. And there's an extra cost specific to reading text with Spark: schema inference. If you don't supply a schema, Spark reads the data once to guess the types, then reads it again to actually load it. That's double the I/O before any work happens. Passing an explicit schema eliminates the first pass entirely, and it's worth doing even for exploratory work on anything large. It also eliminates a subtler problem: a guessed schema is eventually a wrong schema. One file where an id column contains a value with a leading zero, or an empty string, and Spark infers string instead of integer — and now your join keys don't match across files. So the practical stance is this. CSV and JSON are interchange formats. They're fine at the edges of a system: how data arrives from a partner, how it leaves for a spreadsheet. They are the wrong place to keep data. Read it once, with an explicit schema, write Parquet, and every query after that gets the whole skipping ladder.",
}
