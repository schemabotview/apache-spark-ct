import type { Scene } from '@graphlearning/flow'

// §5.1 — the daily summary query beside the four plans explain("extended") printed for it in 4.0.1,
// one card per phase in reading order (a 2×2 grid: left to right, top to bottom), each with the
// change that phase made.
export const planPhases: Scene = {
  id: 'plan-phases',
  title: 'From code to four plans',
  flow: 'TB',
  nodes: [
    {
      id: 'summary-query',
      kind: 'code',
      filename: 'summary.py',
      label: `t = (orders
     .where(F.col("status") == "COMPLETED")
     .join(stores, "store_id")
     .groupBy("city")
     .agg(F.count("*").alias("orders"),
          F.sum("amount").alias("sales")))

t.explain("extended")`,
    },
    {
      id: 'plan-sequence',
      label: 'explain("extended")',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'parsed-plan', label: 'Parsed', sub: "names unresolved: 'city", badge: '01', pattern: 'external', icon: 'file' },
        { id: 'analyzed-plan', label: 'Analyzed', sub: 'types: sales decimal(20,2)', badge: '02', pattern: 'service', icon: 'search' },
        { id: 'optimized-plan', label: 'Optimized', sub: 'filters pushed, columns pruned', badge: '03', pattern: 'service', icon: 'funnel' },
        { id: 'physical-plan', label: 'Physical', sub: 'a broadcast hash join', badge: '04', pattern: 'network', icon: 'cpu' },
      ],
    },
  ],
  edges: [{ source: 'summary-query', target: 'plan-sequence' }],
}
