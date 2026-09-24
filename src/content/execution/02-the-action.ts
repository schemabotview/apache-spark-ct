import type { Section } from '../types'

export const theAction: Section = {
  id: 'the-action',
  title: 'The action, and what it costs',
  scene: 'exec-the-action',
  focus: 'trap',
  slide: `## The action

Anything that needs a **real answer**, not another description.

| | |
|---|---|
| **A value to the driver** | \`count\` · \`collect\` · \`first\` · \`take\` |
| **A write to storage** | \`save\` · \`write\` · \`saveAsTable\` |
| **Rows on your screen** | \`show\` — yes, this counts |

### One action, one job
And the job runs the **whole plan behind it. Every time.**

### The trap that follows
\`\`\`
df.count()   # job 1 — reads the source
df.show()    # job 2 — reads it again
df.write(…)  # job 3 — reads it a third time
\`\`\`

Three actions on one DataFrame is **three jobs**, each re-running the entire chain from the source. A DataFrame is a recipe, not a result — and a recipe gets re-cooked.

> This is what \`cache()\` is for: it's the only way to say *"keep the result of this, I'll want it again."*`,
  narration:
    "So if transformations don't do anything, what does? An action. An action is anything that needs a real answer rather than another description. Three kinds. Something that returns a value to the driver — count, collect, first, take. Something that writes to storage — save, write, saveAsTable. And something that shows rows on your screen, which is show. People often don't think of show as an action, and it is one; it's just an action with a small limit on it. The rule is: one action, one job. And here's the part that costs people money. The job runs the whole plan behind it, every time. So watch what happens with a perfectly ordinary-looking piece of code. You call count on your DataFrame to check the size. That's job one — it reads the source, filters, groups, counts. Then you call show to eyeball a few rows. That's job two, and it reads the source again from scratch. Then you write the result out. Job three. Same source, read a third time. Three actions, three complete re-executions, and nothing was reused. The mental model that prevents this is: a DataFrame is a recipe, not a result. When you assign it to a variable, you have not stored any data. You've stored instructions. And instructions get followed again every time you ask for something. This is precisely what cache is for — it's the only way to tell Spark: keep the result of this bit, because I'm going to want it again. Without it, every action pays the full price from the beginning.",
}
