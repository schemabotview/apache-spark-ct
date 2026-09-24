import type { Section } from '../types'

export const theAnalyzer: Section = {
  id: 'the-analyzer',
  title: 'The analyzer: binding names to reality',
  scene: 'cat-analyzer',
  focus: 'after',
  slide: `## The analyzer

Walks the unresolved tree, and for every name asks the catalog: **what is this?**

\`\`\`
'Filter ('country = IN)   ← a name
Filter (country#9 = IN)   ← a typed column, with an id
\`\`\`

The apostrophes disappear. \`#9\` is an **attribute id** — unique for the life of the plan, which is how Spark keeps two columns called \`id\` from two tables apart.

It also inserts **casts**, resolves **function names**, and expands \`SELECT *\` into an actual column list.

### Or it refuses — and this is the error you get *fast*
| | |
|---|---|
| \`cannot resolve 'dst'\` | no such column |
| \`Table or view not found\` | no such table |
| \`Reference 'id' is ambiguous\` | both sides of a join have it |

Analysis runs **as you build the plan**, long before any action. That's why a column typo fails immediately while a bad cast waits for \`.show()\`.`,
  narration:
    "The analyzer is the stage that turns names into things. It walks the unresolved tree, and for every name it finds, it asks the catalog: what is this, actually? Before: Filter, apostrophe-country equals I-N. After: Filter, country hash nine, equals I-N. The apostrophe is gone, because country is now bound to a real column with a real type. And that hash-nine is an attribute id — a unique number assigned for the life of this plan. That id is how Spark keeps track of which column is which when you join two tables that both have a column called id. Humans see ambiguity; the plan sees hash-nine and hash-forty-two, and there's no confusion. The analyzer does more than binding. It inserts casts where types need converting. It resolves function names to actual implementations. It expands SELECT star into a real list of columns — which is why a star in a saved view captures the columns as they were at creation time. And crucially, it can refuse. If you reference a column that doesn't exist, you get cannot resolve, along with a list of the columns that do exist, which is genuinely one of Spark's better error messages. If the table isn't there, table or view not found. If you join two tables that both have id and then reference id unqualified, reference is ambiguous. Here's the practical detail worth knowing. Analysis runs as you build the plan — not when you call an action. So a column typo fails immediately, on the line where you wrote it. A bad cast, or a division by zero, waits until an action actually runs. That's why some Spark errors are helpfully local and others arrive two hundred lines later.",
}
