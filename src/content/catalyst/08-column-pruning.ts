import type { Section } from '../types'

export const columnPruning: Section = {
  id: 'column-pruning',
  title: 'Column pruning: the rule that saves more and gets named less',
  scene: 'cat-pruning',
  focus: 'result',
  slide: `## Column pruning

Your query touches **three** columns. The table has **two hundred**.

\`\`\`sql
SELECT dest, sum(cnt) FROM flights
WHERE country = 'IN' GROUP BY dest
\`\`\`

Catalyst walks the tree from the top, collecting which attributes are actually referenced, and narrows the scan to exactly those.

\`\`\`
FileScan parquet [dest#7, country#9, cnt#11L]
  ReadSchema: struct<dest,country,cnt>
\`\`\`

### Why it's worth more than pushdown, often
A columnar format stores each column **separately**. So reading 3 of 200 columns genuinely reads about 1.5% of the bytes — the rest is never touched on disk.

Predicate pushdown skips *rows*. Column pruning skips *columns*. On a wide table, the second is usually the bigger win — and it's the one nobody talks about.

> \`SELECT *\` disables it completely. That's the real cost of a star.`,
  narration:
    "Predicate pushdown gets all the attention. Column pruning usually saves more, and hardly anyone mentions it. Here's the situation. You have a wide table — an events table, two hundred columns, the kind that accumulates over years as people add fields. Your query mentions three of them: dest, country, and cnt. Catalyst walks the plan from the top down, collecting the set of attributes that are actually referenced anywhere, and then narrows the scan node to exactly that set. You can see the result in the plan: the FileScan lists three columns, and ReadSchema confirms it. Now, why does this matter so much? Because of how columnar formats work. Parquet doesn't store rows together; it stores each column's values together, in separate chunks. So if you ask for three columns out of two hundred, the reader seeks to those three chunks and never touches the rest. You're reading roughly one and a half percent of the bytes. Not reading two hundred columns and discarding a hundred and ninety-seven — genuinely not reading them. Compare the two optimizations. Predicate pushdown skips rows. Column pruning skips columns. On a narrow table with a selective filter, pushdown wins. On a wide table — and real analytical tables are wide — pruning usually wins by more. And here's the practical consequence, which is the most actionable thing in this course. SELECT star disables column pruning completely. You've told Spark you need all two hundred columns, so it reads all two hundred. That's the real cost of a star: not verbosity, not style — a hundred-fold increase in bytes read.",
}
