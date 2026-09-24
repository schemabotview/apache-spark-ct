import type { Section } from '../types'

export const theUnboundedTable: Section = {
  id: 'the-unbounded-table',
  title: 'A stream is a table that never finishes',
  scene: 'str-unbounded-table',
  focus: 'result',
  slide: `## A stream is a table

Not a sequence of events to react to. **A table** — one that happens never to be finished.

New data arriving is **rows appended.** That's the whole model.

### So your query is a query against that table
\`\`\`python
df.groupBy("dest").count()
\`\`\`
The same line you'd write over a finished table. Unchanged.

### And the result is kept up to date
| | |
|---|---|
| **Think:** recomputed from all input, every time | the model you reason with |
| **Run:** incrementally | what actually happens |

That gap is an implementation detail — the point is you get to *reason* with the simple model and still get efficient execution.

> Which is why streaming stops being a separate skill. If you can write the batch query, you can write the streaming one.`,
  narration:
    "Structured Streaming's central idea is a reframing, and it's worth sitting with because everything else follows from it. A stream is not a sequence of events you react to, with callbacks and handlers and ordering to worry about. A stream is a table. It's a table that happens never to be finished. New data arriving is rows being appended to the bottom of it. That's the whole model. And because it's a table, your query is a query against a table. You write group by destination, count — exactly the line you would write against a finished table sitting in a file. Not an analogous line, not a streaming equivalent. The same line. Then the result is a table too, and Spark keeps it up to date as input arrives. Now, the way to reason about it is: every time new data arrives, the entire query is recomputed from all input received so far, and the result table is replaced. That's the mental model, and it's simple enough to reason about correctly. What actually happens is that Spark executes it incrementally, because recomputing from all input forever would be impossible. But the point of the model is that you don't have to think about that to get the right answer. You think in terms of a table and a query; the engine handles the rest. The consequence is that streaming stops being a separate skill with its own concepts. If you can write the batch query, you can write the streaming one. What's left to learn is time, and state — and those are the back half of this course.",
}
