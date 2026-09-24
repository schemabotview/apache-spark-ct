import type { Scene } from '@graphlearning/flow'

export const dynamicPartitionPruning: Scene = {
  id: 'aqe-dpp',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'query',
      label: 'The classic star-schema shape',
      pattern: 'group',
      sub: 'a filter on the DIMENSION, a join to the FACT, and no filter the fact table can use directly',
      cols: 2,
      children: [
        { id: 'q-dim', label: 'dim_date', pattern: 'network', sub: 'small · WHERE quarter = Q3' },
        { id: 'q-fact', label: 'fact_sales', pattern: 'storage', sub: 'huge · 2 years · partitioned · unfiltered' },
      ],
    },
    {
      id: 'build',
      label: 'So Spark builds the filter it needs',
      pattern: 'group',
      sub: 'run the dimension side first, collect the join keys that survived, and turn them into a predicate',
      cols: 2,
      children: [
        { id: 'b-run', label: 'the small side runs first', pattern: 'service', sub: 'it was being broadcast anyway' },
        { id: 'b-keys', label: 'its keys become a filter', pattern: 'service', sub: 'date_id IN (…the Q3 days…)' },
      ],
    },
    {
      id: 'apply',
      label: 'Pushed into the scan',
      pattern: 'service',
      icon: 'filter',
      sub: '90 partitions of 730 — the rest never even listed',
    },
  ],
  edges: [
    { source: 'query', target: 'build' },
    { source: 'build', target: 'apply' },
  ],
}
