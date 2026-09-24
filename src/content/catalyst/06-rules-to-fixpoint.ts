import type { Section } from '../types'

export const rulesToFixpoint: Section = {
  id: 'rules-to-fixpoint',
  title: 'A rule is a function from tree to tree',
  scene: 'cat-rules',
  focus: 'example',
  slide: `## A rule is a function from tree to tree

Pattern-match a shape; return a replacement. Nothing more exotic than that.

\`\`\`
(2 + 3) * cnt > 100    ← as written
5 * cnt > 100          ← ConstantFolding fired
\`\`\`

Evaluated **once at plan time**, not once per row. Over a billion rows that's a billion additions saved, for free.

### Rules run in batches, to a **fixed point**
A batch repeats until a full pass changes nothing.

**Why repeat?** Because one rule firing exposes work for another. Fold a constant, and a filter becomes simple enough to push down. Push a filter down, and a column becomes unused and prunable.

**Why it stops:** a pass with no changes — or \`maxIterations\`, which logs a warning if you hit it.

### Why this design matters
Each rule is small, independent, and testable. Adding an optimization to Spark means adding one function — not editing a monolith.`,
  narration:
    "Now we get to the optimizer proper, and the mechanism is simpler than you'd expect. A rule is a function from a tree to a tree. It pattern-matches a shape, and returns a replacement. That's it. Here's the simplest possible example, called constant folding. Suppose your expression contains two plus three, times count, greater than a hundred. The rule says: wherever you find an operator whose children are both literals, evaluate it right now and replace the node with the result. So two plus three becomes five, at planning time. Think about what that saves. Without it, Spark would compute two plus three once for every row in your dataset. A billion rows, a billion pointless additions. The rule removes them all, once, for free. Now, rules don't run once. They run in batches, repeatedly, until a full pass over the tree changes nothing — that's called reaching a fixed point. And the reason is that rules feed each other. Folding a constant can make a filter simple enough that another rule recognises it as pushable. Pushing a filter down can make a column unused, which lets column pruning remove it. So one pass isn't enough; you keep going until the tree stops changing. There's also a maxIterations limit, and if you ever hit it Spark logs a warning, which usually means something pathological about your plan. The reason this architecture is worth admiring is what it does for the people who work on Spark. Adding an optimization means writing one small, independent, testable function and registering it in a batch. You don't have to understand or modify a giant monolithic optimizer. That's why Catalyst accumulated so many optimizations so quickly.",
}
