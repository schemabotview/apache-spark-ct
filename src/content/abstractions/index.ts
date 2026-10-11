import type { Course } from '../types'
import { rddsAndLineage } from './01-rdds-and-lineage'
import { pairRdds } from './02-pair-rdds'
import { closuresAndSharedVariables } from './03-closures-and-shared-variables'
import { dataframesAndSchemas } from './04-dataframes-and-schemas'
import { columnsAndExpressions } from './05-columns-and-expressions'
import { filterGroupAggregate } from './06-filter-group-aggregate'
import { sparkSqlAndCatalog } from './07-spark-sql-and-catalog'
import { choosingAnAbstraction } from './08-choosing-an-abstraction'
import { readingSources } from './09-reading-sources'
import { writingDatasets } from './10-writing-datasets'
import { collectionAndSideEffects } from './11-collection-and-side-effects'
import { workedBatchPipeline } from './12-worked-batch-pipeline'

// Chapter 3 of docs/APACHE-SPARK-COURSE-PLAN.md — one section per numbered item, in plan order.
// Every result shown in its scenes was produced by PySpark 4.0.1 (local[2]) on the six-order sample.
export const abstractions: Course = {
  id: 'abstractions',
  title: 'Spark Programming Abstractions: RDDs, DataFrames, and SQL',
  sections: [
    rddsAndLineage,
    pairRdds,
    closuresAndSharedVariables,
    dataframesAndSchemas,
    columnsAndExpressions,
    filterGroupAggregate,
    sparkSqlAndCatalog,
    choosingAnAbstraction,
    readingSources,
    writingDatasets,
    collectionAndSideEffects,
    workedBatchPipeline,
  ],
}
