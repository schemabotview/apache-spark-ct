import type { Scene } from '@graphlearning/flow'

// §2.4 — the same pipeline split into what only grows the plan and what runs it. The two list cards
// are the reference half; the code card's comments are the worked trace the slide repeats.
export const lazyPlan: Scene = {
  id: 'lazy-plan',
  title: 'Transformations build, actions run',
  flow: 'TB',
  nodes: [
    {
      id: 'lazy-code',
      kind: 'code',
      filename: 'daily_sales.py',
      label: `completed = orders.where(F.col("status") == "COMPLETED")
daily = completed.groupBy("store_id").agg(F.sum("amount"))
# 0 jobs so far: two transformations, a bigger plan

daily.count()                           # action: job reads input
daily.write.parquet("out/daily_sales/") # action: reads it again`,
    },
    {
      id: 'operation-kinds',
      label: 'Two kinds of operation',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'transformations',
          kind: 'list',
          framed: true,
          label: 'Transformations',
          sub: 'return a new DataFrame',
          icon: 'workflow',
          pattern: 'service',
          items: ['where / filter', 'select, withColumn', 'groupBy(...).agg', 'join, union, distinct', 'orderBy'],
        },
        {
          id: 'actions',
          kind: 'list',
          framed: true,
          label: 'Actions',
          sub: 'return a result or write',
          icon: 'zap',
          pattern: 'warn',
          items: ['count', 'show, take, first', 'collect', 'write ... save / parquet', 'foreach'],
        },
      ],
    },
  ],
  edges: [{ source: 'lazy-code', target: 'operation-kinds' }],
}
