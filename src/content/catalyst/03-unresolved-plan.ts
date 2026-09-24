import type { Section } from '../types'

export const unresolvedPlan: Section = {
  id: 'unresolved-plan',
  title: 'The unresolved plan: valid syntax, unknown names',
  scene: 'cat-unresolved',
  focus: 'plan',
  slide: `## The unresolved plan

The parser's output. **Real nodes, unknown names.**

\`\`\`
'Project ['dest, 'total]
+- 'Aggregate ['dest], [sum('cnt)]
   +- 'Filter ('country = IN)
      +- 'UnresolvedRelation [flights]
\`\`\`

The apostrophe prefix means **unresolved**. Every name in there is a string nobody has checked.

### What it knows
The *shape* is valid: a projection over an aggregate over a filter over a relation. The grammar held.

### What it doesn't
- Is \`flights\` a table? Which one? Where?
- Does \`country\` exist? Is it a string?
- Can \`cnt\` be summed, or is it text?

> This is exactly the line between a **syntax** error and an **analysis** error — and why the two arrive at different moments.`,
  narration:
    "The first thing that exists is the parser's output, called the unresolved logical plan, and the word unresolved is doing a lot of work. You get a real tree. Project at the top, over an Aggregate, over a Filter, over something called UnresolvedRelation. Those are genuine plan nodes with genuine structure. But look at the names in them. In Spark's printed plans, a name with an apostrophe in front of it means unresolved — it's a string that somebody typed, and nothing has checked it against anything. So what does this plan actually know? It knows the shape is valid. You asked for a projection over an aggregate over a filter over a relation, and that's a well-formed thing to ask for. The grammar held. What it doesn't know is essentially everything else. Is flights a table? Is it a view? Does it exist at all, and if so where does it live and what format is it in? Does the column country exist on it? Is country even a string, so that comparing it to the text I-N makes sense? Can cnt be summed, or is it actually a text column, in which case summing it is nonsense? None of that is known. And this is precisely the boundary between two kinds of error that arrive at different times. If you write SELECT FRUM with a typo, that's a syntax error and you never get a tree at all. If you write SELECT dst instead of dest, the grammar is perfectly happy — you get this tree, with an unresolved name in it — and the failure comes at the next stage.",
}
