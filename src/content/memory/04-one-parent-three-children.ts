import type { Section } from '../types'

export const oneParentThreeChildren: Section = {
  id: 'one-parent-three-children',
  title: 'The only situation where caching reliably pays',
  scene: 'mem-one-parent',
  focus: 'with',
  slide: `## When caching pays

An ordinary shape: read, clean, then answer three questions from the cleaned data.

\`\`\`python
clean = raw.filter(...).join(...)   # expensive
clean.count()                       # job 1
clean.write(summary)                # job 2
clean.write(detail)                 # job 3
\`\`\`

### Without cache: the parent runs **three times**
A DataFrame is a recipe, not a result. Each action re-cooks it from the source — three reads, three joins.

### With cache: once, then reused
\`\`\`python
clean.cache()
clean.count()   # fills it
\`\`\`

### The condition, stated precisely
Cache a parent that is **expensive**, **shared** by several downstream actions, and **reused**.

Miss any of the three and caching costs memory it never repays — memory that execution then has to evict, which makes things *worse*.

> If it's used once, caching is pure loss. That's the commonest misuse.`,
  narration:
    "So when should you cache? There's one shape where it reliably pays, and it's worth being precise, because caching is misused more than almost anything else in Spark. Here's the shape. You read some raw data, filter it, join it to something — that's expensive. Call the result clean. Then you do three things with clean: count it to check the size, write a summary, and write a detailed output. Three actions. Without caching, that's three jobs, and each one re-runs the entire chain from the source. Three reads of the raw data, three filters, three joins. Because a DataFrame is a recipe, not a result — assigning it to a variable stores instructions, and instructions get followed again every time you ask for something. With cache, the first action materialises the result and keeps it, and the other two read from memory. One read, one join, done. Now here's the condition, and all three parts have to hold. The parent must be expensive — if it's a cheap scan, recomputing is fine. It must be shared by several downstream actions. And it must actually be reused — used more than once. Miss any one of those and caching costs you memory it never repays. And this is worse than neutral, because that memory isn't free: it comes out of the same pool execution needs, so execution has to evict it, and now you've added work without saving any. The commonest misuse in Spark is caching something used exactly once, usually because someone read that caching makes things faster. On a single-use DataFrame it is pure loss.",
}
