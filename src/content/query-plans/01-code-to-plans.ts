import type { Section } from '../types'

export const codeToPlans: Section = {
  id: 'code-to-plans',
  title: 'From DataFrame or SQL code to logical and physical plans',
  scene: 'plan-phases',
  focus: 'physical-plan',
  slide: `## From code to plans

**Objective:** read \`explain()\` and name the phase behind each change.

### Four plans for one query
1. **Parsed:** the code as written; \`'city\` unresolved
2. **Analyzed:** types bound — \`sales: decimal(20,2)\`
3. **Optimized:** filters pushed, \`order_id\` pruned
4. **Physical:** \`BroadcastHashJoin\`, \`Exchange\` chosen

### How to read the output
- Read the tree **bottom up**: data enters at the leaves
- \`explain()\` prints the physical plan; \`"extended"\`, all four
- \`AdaptiveSparkPlan\`: it can still **change at runtime**

### The misconception
"My code runs as written." It is a **request**; the plan is what runs.`,
  narration:
    "This chapter opens the box between your code and its execution. Everything you write, whether DataFrame calls or SQL, becomes a plan before anything runs, and explain shows you that plan. Here is the daily summary query again, now on one million generated orders and fifty stores, and explain extended prints four versions of it. The parsed plan is your code as written. Names such as city carry a leading quote mark, meaning they have not been looked up yet. The analyzed plan has resolved every name against the data's schema and worked out every type, so it can say that sales is a decimal with twenty digits. The optimized plan is the result of rewrite rules. The filter has moved down next to the order data, and columns the query never uses, such as order id, have been pruned away. Finally the physical plan picks concrete operators: a broadcast hash join for the stores, and exchanges where data must move. Read these trees from the bottom up, because the data enters at the leaves. Plain explain prints only the physical plan, and with adaptive execution on, that plan sits inside an adaptive spark plan node, a reminder that it can still change while the job runs. So drop the idea that your code runs as written. Your code is a request. The plan is what actually runs, and the rest of this chapter takes each phase in turn.",
}
