import type { Scene } from '@graphlearning/flow'
import { rddLineage } from './rdd-lineage'
import { pairRddAggregation } from './pair-rdd-aggregation'
import { closuresSharedVariables } from './closures-shared-variables'
import { dataframeSchema } from './dataframe-schema'
import { columnExpressions } from './column-expressions'
import { filterGroupAggregate } from './filter-group-aggregate'
import { sqlAndCatalog } from './sql-and-catalog'
import { abstractionChoice } from './abstraction-choice'
import { readingSources } from './reading-sources'
import { writeOutput } from './write-output'
import { driverCollection } from './driver-collection'
import { batchPipelineCase } from './batch-pipeline-case'

// One bundle per course folder, spread into src/scenes/index.ts.
export const abstractionsScenes: Scene[] = [
  rddLineage,
  pairRddAggregation,
  closuresSharedVariables,
  dataframeSchema,
  columnExpressions,
  filterGroupAggregate,
  sqlAndCatalog,
  abstractionChoice,
  readingSources,
  writeOutput,
  driverCollection,
  batchPipelineCase,
]
