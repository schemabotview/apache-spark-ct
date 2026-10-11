import type { Scene } from '@graphlearning/flow'

// §1.5 — the course's recurring example, drawn once and reused: later courses point `focus` at the
// stage they are about instead of redrawing it. Keep node ids stable — sections in other courses
// reference them. The stages sit inside one `spark-application` container, between the sources and
// outputs that other systems own: the same scope boundary §1.5's slide draws.
export const retailPipeline: Scene = {
  id: 'retail-pipeline',
  title: 'The retail order-event pipeline',
  flow: 'LR',
  nodes: [
    {
      id: 'retail-sources',
      label: 'Sources',
      pattern: 'group',
      cols: 1,
      children: [
        { id: 'order-events', label: 'Order events', sub: 'JSON, all day long', pattern: 'storage', icon: 'receipt' },
        { id: 'product-catalog', label: 'Products', sub: 'reference data', pattern: 'storage', icon: 'tag' },
        { id: 'store-list', label: 'Stores', sub: 'reference data', pattern: 'storage', icon: 'building' },
      ],
    },
    {
      id: 'spark-application',
      label: 'Spark application',
      pattern: 'service',
      flow: 'TB',
      children: [
        { id: 'ingest', label: 'Ingest', sub: 'read with a schema', pattern: 'service', icon: 'file' },
        { id: 'clean', label: 'Clean', sub: 'quarantine bad events', pattern: 'service', icon: 'funnel' },
        { id: 'enrich', label: 'Enrich', sub: 'join reference data', pattern: 'service', icon: 'merge' },
        { id: 'summarise', label: 'Summarise', sub: 'daily sales per store', pattern: 'service', icon: 'sigma' },
      ],
      edges: [
        { source: 'ingest', target: 'clean' },
        { source: 'clean', target: 'enrich' },
        { source: 'enrich', target: 'summarise' },
      ],
    },
    {
      id: 'retail-outputs',
      label: 'Outputs',
      pattern: 'group',
      cols: 1,
      children: [
        { id: 'sales-summary', label: 'Sales summary', sub: 'Parquet table', pattern: 'storage', icon: 'table' },
        { id: 'live-updates', label: 'Live updates', sub: 'streaming view', pattern: 'external', icon: 'waves' },
      ],
    },
  ],
  edges: [
    { source: 'retail-sources', target: 'spark-application', label: 'read' },
    { source: 'spark-application', target: 'retail-outputs', label: 'write' },
  ],
}
