import type { Section } from '../types'

export const theProblem: Section = {
  id: 'the-problem',
  title: 'What a join actually has to solve',
  scene: 'joins-the-problem',
  focus: 'gap',
  slide: `## What a join actually has to solve

\`orders ⋈ customers ON customer_id\`. The order is on host A. Its customer row is on host D. **Neither host knows the other has a match.**

### So exactly one of two things must happen
- **Move one side whole** — copy the small table to every machine
- **Move both by key** — repartition so matching rows land together

Every join strategy in Spark is one of those two answers. There is no third.

### The vocabulary the rest of this uses
| Term | Means |
|---|---|
| **build side** | the side held in memory as a lookup structure |
| **probe / stream side** | the side read through once, looking each row up |

The strategies differ on **which side is which**, and **what gets moved to make it possible**.`,
  narration:
    "Before we compare join strategies, it's worth being precise about the problem, because every strategy is an answer to this one question. You have a table of orders and a table of customers, and you want them joined on customer id. An order for customer forty-two is sitting on host A. Customer forty-two's row is sitting on host D. Neither of those machines knows the other one has a match. Nothing in the system has arranged for them to be together. So something has to move. And there are only two things that can possibly move. Either you take one entire table and copy it to every machine, so that wherever a row of the other table lives, its match is already there locally. Or you move both tables, partitioning each of them by the join key, so that all rows with customer id forty-two — from both sides — end up in the same place. That's it. Every join strategy Spark has is one of those two answers, dressed differently. Two pieces of vocabulary before we start, because every strategy uses them. The build side is whichever side gets held in memory as a lookup structure. The probe side, sometimes called the stream side, is the one that gets read through once, checking each row against that structure. What the strategies actually differ on is which side plays which role, and what has to be moved across the network to make it possible. Keep those two questions in your head and the five strategies stop being a list to memorise.",
}
