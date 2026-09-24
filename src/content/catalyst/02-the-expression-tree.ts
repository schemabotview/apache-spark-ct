import type { Section } from '../types'

export const expressionTree: Section = {
  id: 'the-expression-tree',
  title: 'Everything is a tree',
  scene: 'cat-expression-tree',
  focus: 'lt',
  slide: `## Everything is a tree

\`\`\`
((price + 5) * 200) - 6 < budget
\`\`\`

Becomes a tree of **expression nodes** — and the nesting *is* the precedence. There's no parsing left to do.

| Node | What it is |
|---|---|
| \`<\` \`-\` \`*\` \`+\` | operators, each with children |
| \`price\` \`budget\` | \`AttributeReference\` — a column |
| \`5\` \`200\` \`6\` | \`Literal\` — a constant |

### Why this representation, specifically
A tree is **easy to pattern-match on**. "Find any node whose children are both literals" is a few lines of Scala.

That's the whole reason Catalyst is built this way: optimization becomes *tree rewriting*, and a rule becomes a small, testable, independent function.

> Plans are trees of the same kind — just with \`Filter\` and \`Join\` at the nodes instead of \`+\` and \`<\`.`,
  narration:
    "Catalyst's central representation is the tree, and it's worth seeing one concretely before we talk about what gets done to them. Take an expression: open bracket, open bracket, price plus five, close, times two hundred, close, minus six, less than budget. As a string that's a mess to reason about. As a tree it's completely clear. The root is the less-than comparison. Its left child is the subtraction. That subtraction's left child is the multiplication, whose left child is the addition, whose children are the column price and the literal five. On the right of the root sits the column budget. Three kinds of node. Operators, each with children. AttributeReferences, which are columns — price and budget. And Literals, which are constants — five, two hundred, six. Notice something: the nesting is the precedence. There's no parsing left to do, no operator precedence to remember, no ambiguity. The shape already says what happens first. Now, why build it this way? Because a tree is extremely easy to pattern-match on. If you want to write an optimization that says find any node whose children are both literals and evaluate it now, that's a few lines of Scala against a tree. It would be a nightmare against a string. And that's the key design decision in Catalyst: optimization becomes tree rewriting, which means each rule can be a small, independent, testable function. Plans are trees of exactly the same kind — the same machinery, just with Filter and Join at the nodes instead of plus and less-than.",
}
