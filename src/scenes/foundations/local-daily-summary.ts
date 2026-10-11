import type { Scene } from '@graphlearning/flow'

// §1.1 — the single-machine baseline: the retail daily summary in plain pandas, above the four limits
// that decide whether it has to be distributed. The code is deliberately correct and reasonable; the
// point is that it stops working when the workload grows, not that it was written badly.
export const localDailySummary: Scene = {
  id: 'local-daily-summary',
  title: 'The daily summary on one machine',
  flow: 'TB',
  nodes: [
    {
      id: 'pandas-code',
      kind: 'code',
      filename: 'daily_summary_local.py',
      label: `import pandas as pd

# One day of order events (~200 GB of JSON lines)
orders = pd.read_json("orders/2026-10-01.jsonl", lines=True)

daily = (orders[orders["status"] == "COMPLETED"]
         .groupby("store_id")["amount"]
         .sum())`,
    },
    {
      id: 'one-machine-limits',
      label: 'Where one machine runs out',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'memory-limit', label: 'Memory', sub: 'all input held by one process', pattern: 'warn', icon: 'memory' },
        { id: 'scan-limit', label: 'Scan time', sub: 'one disk reads every byte', pattern: 'warn', icon: 'harddrive' },
        { id: 'deadline-limit', label: 'Deadline', sub: 'ready before stores open', pattern: 'warn', icon: 'clock' },
        { id: 'crash-limit', label: 'One crash', sub: 'restarts from the beginning', pattern: 'warn', icon: 'power' },
      ],
    },
  ],
  edges: [{ source: 'pandas-code', target: 'one-machine-limits', label: 'as data grows' }],
}
