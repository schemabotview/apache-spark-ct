import type { Scene } from '@graphlearning/flow'

export const theLoop: Scene = {
  id: 'aqe-loop',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'loop',
      label: 'Plan a bit, run a bit, look, plan again',
      pattern: 'group',
      sub: 'on by default since Spark 3.2 — spark.sql.adaptive.enabled, which is now a thing to KNOW rather than a thing to turn on',
      children: [
        { id: 'l-run', label: 'run the next query stage', pattern: 'service', sub: 'to completion, shuffle written' },
        { id: 'l-read', label: 'read its real statistics', pattern: 'network', sub: 'measured, not estimated' },
        { id: 'l-replan', label: 're-optimize what is left', pattern: 'network', sub: 'Catalyst runs again on the remainder' },
        { id: 'l-next', label: 'repeat at the next', pattern: 'service', sub: 'until the query is finished' },
      ],
      edges: [
        { source: 'l-run', target: 'l-read' },
        { source: 'l-read', target: 'l-replan' },
        { source: 'l-replan', target: 'l-next' },
      ],
    },
    {
      id: 'shape',
      label: 'Which changes what a plan IS',
      pattern: 'group',
      sub: 'not one decision taken before the job, but a sequence of decisions taken during it',
      cols: 2,
      children: [
        { id: 's-before', label: 'before: one plan', pattern: 'warn', sub: 'fixed at submit time' },
        { id: 's-after', label: 'after: a plan per stage', pattern: 'service', sub: 'each one better informed' },
      ],
    },
  ],
  edges: [{ source: 'loop', target: 'shape' }],
}
