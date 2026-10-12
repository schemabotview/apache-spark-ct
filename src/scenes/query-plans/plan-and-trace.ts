import type { Scene } from '@graphlearning/flow'

// §5.6 — the executed plan's skeleton next to what Spark's monitoring REST API reported for the
// same action: jobs, stages, tasks and records, from the 1,000,000-order run on local[4].
export const planAndTrace: Scene = {
  id: 'plan-and-trace',
  title: 'A plan and its execution trace',
  flow: 'TB',
  nodes: [
    {
      id: 'final-plan',
      kind: 'code',
      filename: 'executed plan (AQE final) — trimmed',
      label: `AdaptiveSparkPlan isFinalPlan=true
ResultQueryStage 2
+- *(3) HashAggregate(keys=[city], [count, sum])
   +- AQEShuffleRead coalesced
      +- ShuffleQueryStage 1
         +- Exchange hashpartitioning(city, 200)
            +- *(2) HashAggregate(partial ...)
               +- *(2) BroadcastHashJoin ...
                  :- *(2) Filter ... FileScan orders
                  +- BroadcastQueryStage 0
                     +- BroadcastExchange
                        +- *(1) FileScan stores`,
    },
    {
      id: 'trace-table',
      kind: 'table',
      label: '/api/v1/applications/<id>/stages',
      sub: 'one collect(), local[4]',
      headers: ['job', 'stage', 'tasks', 'input rows', 'shuffle write', 'shuffle read'],
      values: [
        ['14', '15', '1', '50', '–', '–'],
        ['15', '16', '4', '1,000,000', '200 rec, 17,239 B', '–'],
        ['16', '17 (skipped)', '4', '–', '–', '–'],
        ['16', '18', '1', '–', '–', '200 rec'],
      ],
    },
  ],
  edges: [{ source: 'final-plan', target: 'trace-table', label: 'collect()' }],
}
