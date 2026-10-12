import type { Scene } from '@graphlearning/flow'

// §8.11 — the retail pipeline's production design as a responsibility matrix: the decision taken for
// each concern, and whether Spark or an outside system supplies the guarantee.
export const productionReview: Scene = {
  id: 'production-review',
  title: 'The retail pipeline in production',
  flow: 'TB',
  nodes: [
    {
      id: 'responsibility-table',
      kind: 'table',
      label: 'Responsibility matrix',
      sub: 'retail order-event pipeline',
      headers: ['concern', 'decision', 'guaranteed by'],
      values: [
        ['deploy', 'K8s, cluster mode', 'K8s + Spark'],
        ['capacity', '50 × 4 cores, 8 waves', 'measured runs'],
        ['quality', 'counts, keys, quarantine', 'pipeline checks'],
        ['observe', 'event logs, alert at 45 min', 'history server'],
        ['task retry', 'idempotent writes', 'Spark + committer'],
        ['atomic tables', 'table format', 'format log'],
        ['streaming', 'checkpoint, batchId sink', 'source + sink'],
        ['security', 'auth, TLS, secrets store', 'platform'],
      ],
    },
    {
      id: 'review-gaps',
      kind: 'list',
      framed: true,
      label: 'Open risks in the critique',
      icon: 'bug',
      pattern: 'warn',
      items: [
        'Store 7 skew still sets the daily runtime',
        'o7-style late events missing from windows',
        'Connect server needs a proxy before notebooks use it',
      ],
    },
  ],
  edges: [],
}
