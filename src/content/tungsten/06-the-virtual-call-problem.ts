import type { Section } from '../types'

export const virtualCallProblem: Section = {
  id: 'the-virtual-call-problem',
  title: 'The other half: how the plan is executed',
  scene: 'tun-virtual-calls',
  focus: 'cost',
  slide: `## The other half of the problem

Memory layout was half. The other half is **how the operator tree is executed.**

### The classic model
Every operator is an iterator. Each calls \`next()\` on its child.

\`\`\`
Project.next() → Filter.next() → Scan.next()
\`\`\`

This is the textbook design — correct, general, and easy to reason about. It's also how most databases worked for decades.

### What it costs, per row, per operator
| | |
|---|---|
| **A virtual call** | not inlinable, hard to branch-predict |
| **An intermediate row** | materialised between every pair |
| **Overhead > work** | the call costs more than the comparison inside it |

For a filter that does one string comparison, you're paying a method dispatch and an object allocation to perform a single \`equals\`.

> Correct, general, and entirely dominated by its own bookkeeping.`,
  narration:
    "Memory layout was half the story. The other half is how the plan actually gets executed, and it's a separate problem with a separate fix. The classic design — the one in every database textbook, and how most engines worked for decades — is that every operator is an iterator. Project has a next method, which calls next on Filter, which calls next on Scan, which returns a row. Pull one row through the whole chain, then pull the next. It's called the Volcano model, and it has real virtues: it's correct, it's completely general, any operator composes with any other, and it's easy to reason about. But count what it costs. Per row, per operator, you pay a virtual method call. Virtual means the JVM can't always tell at compile time which implementation will be invoked, so it can't reliably inline it, and the branch predictor has a harder time. You also materialise an intermediate row object between every pair of operators. Now compare that against the work being done. For a filter, the actual work is one string comparison. And around that single comparison you've wrapped a virtual dispatch and an object allocation. The overhead isn't a percentage on top of the work — it dominates the work, often by an order of magnitude. So you have an execution model that is correct and general and almost entirely occupied with its own bookkeeping. That's the second thing Tungsten set out to fix, and the fix is quite radical.",
}
