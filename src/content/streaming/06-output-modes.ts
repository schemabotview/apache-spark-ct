import type { Section } from '../types'

export const outputModes: Section = {
  id: 'output-modes',
  title: 'Output modes',
  scene: 'str-output-modes',
  focus: 'table',
  slide: `## Output modes

What gets written **out of** the result table. Not a preference — each is legal only for certain queries, and Spark refuses the others at start-up.

| Mode | Writes | Needs |
|---|---|---|
| **append** | rows that will never change | a **watermark**, for aggregations |
| **update** | rows that changed | a sink that can **upsert** |
| **complete** | the **whole** table, every batch | aggregations · state kept forever |

### Why append needs a watermark
Append promises a row won't change once written. For a running count, Spark can't know that until no more rows for that key can arrive — which is what a watermark declares.

### \`complete\` is the one that ends in tears
Fine in a demo with five keys. Fatal with fifty million.`,
  narration:
    "Output mode decides what gets written out of the result table, and it's not a preference — each mode is legal only for certain kinds of query, and Spark will refuse to start the ones that don't work. Append writes only rows that will never change again. Update writes rows that changed in this batch. Complete writes the entire result table, every batch. The interesting one is append, because of what it requires. Append makes a promise: once a row is written, it won't change. For a simple filter that's trivially true — a row either passed or it didn't. But for a running count per key, Spark cannot make that promise, because another row for that key could arrive at any moment and change the count. So append is illegal for an aggregation unless you've defined a watermark, because the watermark is what declares when no more rows for a window will arrive. That's a nice example of the constraints being real rather than arbitrary. Update is the most generally useful. It writes rows that changed, which is what you want for a dashboard or a lookup table. The catch is that your sink has to handle an upsert rather than a plain insert, or you'll accumulate duplicate versions of the same key. And complete is the one that ends in tears. It rewrites the entire result table every single batch, which means all state is kept forever — every key ever seen, held indefinitely. In a tutorial with five keys, it's the mode that makes the demo work. In production with fifty million keys, it's a job that slowly dies. The error messages in this area are unusually good, by the way: Spark tells you which modes your query supports and why. Worth reading rather than guessing.",
}
