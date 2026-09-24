import type { Section } from '../types'

export const joinTypesCost: Section = {
  id: 'join-types-cost',
  title: 'What the join type costs',
  scene: 'joins-types',
  focus: 'types',
  slide: `## What the join type costs

You know which rows each type *returns*. This is what each one does to the **plan**.

### The pattern
- **\`inner\`** is cheapest — a match is required, so filters push down to **both** sides
- **outer** joins remove that. Rows have to survive whether they match or not, so the filter can't be pushed through
- **\`full outer\`** rules out broadcast in most cases: both sides must shuffle

### The two that are underused
| | |
|---|---|
| **\`left semi\`** | left rows that match. No right columns, so it can stop at the **first** match. |
| **\`left anti\`** | left rows with **no** match. Must scan the whole right side to prove a negative. |

An \`EXISTS\` check written as an inner join **duplicates left rows** when the right side has several matches. \`left semi\` doesn't. It's the same answer, correct by construction, and usually faster.`,
  narration:
    "Join type is usually taught as a set-theory question — which rows come out the other side. That part you already know. What's less often said is that the type changes the plan, not just the result. Start with inner, which is the cheapest and it's worth understanding why. In an inner join, a row only survives if it has a match. That means a filter on either side can be pushed all the way down into the scan of both sides, because anything filtered out couldn't have contributed anyway. Now switch to a left outer join. Suddenly left rows have to survive whether or not they matched. That filter can no longer be pushed through the join, and you end up reading and carrying rows you'll discard later. Full outer is the most constrained of all: both sides have to be preserved entirely, which rules out broadcasting in most cases and forces both sides to shuffle. Then there are two types that are genuinely underused, and I'd encourage you to reach for them. Left semi returns left rows that have a match, but none of the right side's columns. Because it doesn't need the right columns, it can stop at the first match it finds rather than enumerating all of them. And that matters, because the common way people express does this exist is an inner join — which silently duplicates a left row once for every match on the right. Left semi gives the same answer, correct by construction, and usually faster. Left anti is its mirror: left rows with no match. That one is inherently more expensive, because proving a negative means scanning the whole right side.",
}
