import type { Section } from '../types'

export const seeingIt: Section = {
  id: 'seeing-it',
  title: 'Seeing codegen in your own plan',
  scene: 'tun-seeing-it',
  focus: 'code',
  slide: `## Seeing it

\`\`\`
*(1) Project [dest#7]
+- *(1) Filter (country#9 = IN)
   +- FileScan parquet [dest#7,country#9]
\`\`\`

### The \`*\` is the whole signal
\`*(1)\` means **whole-stage codegen stage 1**. Project and Filter carry the *same* number, so they were fused into one generated method.

**No \`*\` means that operator is running the old iterator-at-a-time way.** Worth noticing when a query is slower than it should be.

### Reading the generated source
\`\`\`
df.explain("codegen")
\`\`\`
Prints the actual Java. It's long and mechanical, but skimming one loop once makes everything above concrete — you can see your filter as an \`if\` and your projection as an \`append\`.

> A plan where the expensive operators have no \`*\` is a plan worth a second look.`,
  narration:
    "All of this is visible in your own plans, and it takes about five seconds to check. Run explain on a filtered, projected DataFrame and look at the physical plan. You'll see operators prefixed with an asterisk and a number in brackets. That asterisk is the signal. Asterisk bracket one means this operator is part of whole-stage codegen stage one. And if Project and Filter both carry bracket one, they were fused into the same generated method — one loop doing both. The more useful observation is the negative one. An operator with no asterisk is not part of a codegen stage. It's running the old iterator-at-a-time way, with all the per-row overhead we just discussed. So when a query is slower than you expect, scanning the plan for operators that are missing their asterisk is a genuinely good first move. If your expensive operator isn't generating code, that's worth understanding before you tune anything else. You can go further and read the generated code itself, with explain and the string codegen. What you get is the actual Java that Spark compiled. It's long, it's mechanical, and it's full of generated variable names — but it's worth skimming once, because it makes everything abstract about this course concrete. You can find the while loop. You can find your filter, sitting there as an if statement with a continue. You can find your projection as an append call. Seeing your own query as a loop, once, is the thing that makes the rest of this stick.",
}
