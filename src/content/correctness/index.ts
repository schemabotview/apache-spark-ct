import type { Course } from '../types'
import { schemaEnforcement } from './01-schema-enforcement'
import { nullsAndMalformed } from './02-nulls-and-malformed'
import { castsAndAnsi } from './03-casts-and-ansi'
import { joinCardinality } from './04-join-cardinality'
import { windowFunctions } from './05-window-functions'
import { datesAndTimeZones } from './06-dates-and-time-zones'
import { nestedData } from './07-nested-data'
import { builtinsVsUdfs } from './08-builtins-vs-udfs'
import { workedEdgeCases } from './09-worked-edge-cases'

// Chapter 4 of docs/APACHE-SPARK-COURSE-PLAN.md — one section per numbered item, in plan order.
// Every result in its scenes was produced by PySpark 4.0.1 on deliberately messy extensions of the
// six-order sample.
export const correctness: Course = {
  id: 'correctness',
  title: 'Reasoning About Pipeline Correctness',
  sections: [
    schemaEnforcement,
    nullsAndMalformed,
    castsAndAnsi,
    joinCardinality,
    windowFunctions,
    datesAndTimeZones,
    nestedData,
    builtinsVsUdfs,
    workedEdgeCases,
  ],
}
