import type { Course } from '../types'
import { aCorrectBaseline } from './01-a-correct-baseline'
import { sparkUiMetrics } from './02-the-spark-ui-and-its-metrics'
import { cpuMemorySpill } from './03-cpu-memory-spill-io-scheduling'
import { partitionSizes } from './04-partition-sizes-and-parallelism'
import { shufflesAndRepartitioning } from './05-shuffles-and-repartitioning'
import { joinStrategies } from './06-join-strategies'
import { dataSkew } from './07-data-skew'
import { cachingAndPersistence } from './08-caching-and-persistence'
import { dataLayout } from './09-data-layout'
import { adaptiveQueryExecution } from './10-adaptive-query-execution'
import { executorResources } from './11-executor-resources'
import { beforeAndAfter } from './12-before-and-after'

export const fast: Course = {
  id: 'fast',
  title: 'Make it fast',
  sections: [aCorrectBaseline, sparkUiMetrics, cpuMemorySpill, partitionSizes, shufflesAndRepartitioning, joinStrategies, dataSkew, cachingAndPersistence, dataLayout, adaptiveQueryExecution, executorResources, beforeAndAfter],
}
