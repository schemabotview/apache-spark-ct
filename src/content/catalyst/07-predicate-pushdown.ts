import type { Section } from '../types'

export const predicatePushdown: Section = {
  id: 'predicate-pushdown',
  title: 'Predicate pushdown, actually shown',
  scene: 'cat-pushdown',
  focus: 'after',
  slide: `## Predicate pushdown

The rule everyone names. Here it is, on real nodes.

### Before — as written, read bottom-up
\`\`\`
Filter (country#7 = IN)      ← runs on JOINED rows
+- Join (user#3 = user#9)    ← all 4B rows
   +- Relation flights       ← 4B rows
\`\`\`

### After — \`PushDownPredicate\` fired
\`\`\`
Join (user#3 = user#9)       ← now joins 40M
+- Relation flights
     PushedFilters: [country = IN]
\`\`\`

The filter moved **below the join** and **into the scan**. Those rows are never read, never joined, never materialised.

### Why it's allowed
On an **inner** join, a row that fails the filter could never have contributed to the result. The answer is provably identical.

> On an **outer** join it often isn't — the filtered row still has to appear, padded with nulls. That's why outer joins optimize worse.`,
  narration:
    "Predicate pushdown is the optimization everyone can name, and almost nobody has seen. Let's look at it on real plan nodes. Before. Reading bottom-up: there's a relation, four billion rows of flights. Above it, a join against a user table. Above that, a filter on country equals India. As written, that's: join all four billion rows against all the users, producing an enormous intermediate result, and then throw away everything that isn't India. After the rule fires. The filter is gone from the top. It's moved below the join, and further — it's been pushed into the scan itself, and you can see it as PushedFilters on the relation node. So now the file reader skips non-India rows before they're even decoded, and the join receives forty million rows instead of four billion. That's a hundred-fold reduction in the most expensive operation in the query, from moving one node in a tree. Now here's the part that's usually left out, and it's the interesting bit: why is Spark allowed to do this? On an inner join, a row that fails the filter could never have contributed to the final result. If a flight isn't from India, no amount of joining it to users will make it appear in the output. So moving the filter earlier is provably identical in outcome — the optimizer isn't guessing, it's applying an algebraic law. But change it to a left outer join and the reasoning collapses. In an outer join, a left row that doesn't match still has to appear in the output, padded with nulls. So you can't just drop it early. That's a large part of why outer joins optimize so much worse than inner ones, and it's worth knowing when you're choosing a join type.",
}
