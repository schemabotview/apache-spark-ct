import type { Section } from '../types'

export const analysis: Section = {
  id: 'analysis',
  title: 'Analysis: resolve names, types and expressions',
  scene: 'analysis-phase',
  focus: 'analysis-cases',
  slide: `## Analysis

Analysis binds every name to a **column**, **table** or **function**, and every expression to a **type**.

### Worked, on 4.0.1
- \`'count(*)\` becomes \`count(1)\` typed **bigint**; \`sum(amount)\` becomes **decimal(20,2)**
- \`select("amout")\`: \`UNRESOLVED_COLUMN\`, with \`amount\` suggested
- \`store_id = '7'\`: analysis **inserts casts** — \`cast(store_id as bigint) = cast(7 as bigint)\`

### When errors appear
- A bad **name** fails as soon as the DataFrame is defined, in Classic
- A bad **value** fails only when data runs: \`'COMPLETED' + 1\` → \`CAST_INVALID_INPUT\` at \`collect()\`

### The misconception
"A query that analyzes is correct." Analysis proves the **names and types** fit — not the **values**.`,
  narration:
    "The first real work Spark does with your query is analysis. The parsed plan is just structure. Analysis binds each name to something real, a column in the schema, a table in the catalog, a function, and gives every expression a type. Compare the two plans at the top. In the parsed plan, count star and sum of amount are unresolved. After analysis, count star has become count of one, typed as a big integer, and the sum is typed as a decimal with twenty digits, which is where the widened result type from chapter three came from. Now three ways analysis can affect you. Select a misspelled column, amout, and analysis cannot resolve it. The error says so, and helpfully suggests amount. In Classic Spark, this fails the moment you define the DataFrame, before any action. Over Spark Connect, it surfaces later, when the plan reaches the server. Second, compare store id with the string seven, and analysis does not fail. It inserts casts so both sides have the same type, which you can see in the analyzed plan. Third, add one to the status column. That also analyzes, because a string can be cast to a number in principle. It only fails when the data runs and the value completed refuses to become a number. That is the misconception to drop. A query that analyzes is not proven correct. Analysis checks that names and types fit together, not that the values do.",
}
