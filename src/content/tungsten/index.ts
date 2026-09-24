import type { Course } from '../types'
import { theObjectTax } from './01-the-object-tax'
import { theBinaryRow } from './02-the-binary-row'
import { offHeap } from './03-off-heap'
import { encoders } from './04-encoders'
import { cacheLocality } from './05-cache-locality'
import { virtualCallProblem } from './06-the-virtual-call-problem'
import { wholeStageCodegen } from './07-whole-stage-codegen'
import { seeingIt } from './08-seeing-it'
import { whereItStops } from './09-where-it-stops'
import { memoryEras } from './10-the-memory-eras'

// Course 7 of the spine — why a DataFrame beats hand-written RDD code. The course keeps two things
// apart that are usually conflated: a different MEMORY LAYOUT (§§1–5, ending on the cache-latency
// gap that is the real reason it wins) and a different EXECUTION SHAPE (§§6–8, the Volcano model
// and the loop that replaces it). §9 is where codegen stops, which reframes what a UDF costs; §10
// is the memory-manager history that explains why a cache silently shrinks.
//
// COURSE-PLAN.md flags this as one of the courses the four books cannot carry — the Databricks
// excerpt never mentions Tungsten at all. Grounded against the Spark documentation.
export const tungsten: Course = {
  id: 'tungsten',
  title: 'Why DataFrames beat RDDs',
  sections: [
    theObjectTax,
    theBinaryRow,
    offHeap,
    encoders,
    cacheLocality,
    virtualCallProblem,
    wholeStageCodegen,
    seeingIt,
    whereItStops,
    memoryEras,
  ],
}
