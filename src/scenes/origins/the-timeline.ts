import type { Scene } from '@graphlearning/flow'

// §8 — the timeline, as the course's closer. Each date is chosen for what it CHANGED, not for being
// a date: the API generation each one opened is what the rest of this concept is about.
export const theTimeline: Scene = {
  id: 'origins-timeline',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'early',
      label: 'The RDD era',
      pattern: 'group',
      sub: 'you wrote the plan yourself — map, filter, reduceByKey — and Spark ran exactly what you wrote',
      flow: 'LR',
      children: [
        { id: 't-2009', label: '2009 · AMPLab', pattern: 'service', sub: 'a research project at Berkeley' },
        { id: 't-2013', label: '2013 · Apache', pattern: 'service', sub: 'donated; Databricks founded' },
        { id: 't-2014', label: '2014 · 1.0', pattern: 'service', sub: 'RDDs are the API' },
      ],
    },
    {
      id: 'structured',
      label: 'The structured era',
      pattern: 'warn',
      icon: 'gitbranch',
      sub: '2016 · Spark 2.0 · DataFrames — an optimizer picks the plan',
    },
    {
      id: 'adaptive',
      label: 'The adaptive era',
      pattern: 'group',
      sub: 'the plan stops being fixed before the job starts, and is re-decided from real measurements mid-flight',
      flow: 'LR',
      children: [
        { id: 't-2020', label: '2020 · 3.0', pattern: 'network', sub: 'AQE and dynamic pruning arrive' },
        { id: 't-32', label: '2021 · 3.2', pattern: 'network', sub: 'AQE on by default' },
        { id: 't-now', label: '4.x today', pattern: 'network', sub: 'and this is where you start' },
      ],
    },
  ],
  edges: [
    { source: 'early', target: 'structured', label: 'stop writing the plan' },
    { source: 'structured', target: 'adaptive', label: 'stop fixing the plan' },
  ],
}
