import type { Course } from '../types'
import { baseline } from './01-baseline'
import { uiAndMetrics } from './02-ui-and-metrics'
import { resourceSymptoms } from './03-resource-symptoms'
import { partitionSizing } from './04-partition-sizing'
import { shufflesAndRepartitioning } from './05-shuffles-and-repartitioning'
import { joinStrategies } from './06-join-strategies'
import { dataSkew } from './07-data-skew'
import { caching } from './08-caching'
import { dataLayout } from './09-data-layout'
import { aqe } from './10-aqe'
import { executorResources } from './11-executor-resources'
import { workedComparison } from './12-worked-comparison'

// Chapter 6 of docs/APACHE-SPARK-COURSE-PLAN.md — one section per numbered item, in plan order.
// Every timing and metric was measured with PySpark 4.0.1 on local[4] (4 cores, 15 GB) over
// 10,000,000 generated orders: warm-up discarded, medians of 3 (5 where stated).
export const performance: Course = {
  id: 'performance',
  title: 'Performance Diagnosis and Optimisation',
  sections: [
    baseline,
    uiAndMetrics,
    resourceSymptoms,
    partitionSizing,
    shufflesAndRepartitioning,
    joinStrategies,
    dataSkew,
    caching,
    dataLayout,
    aqe,
    executorResources,
    workedComparison,
  ],
}
