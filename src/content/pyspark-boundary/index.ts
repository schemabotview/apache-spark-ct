import type { Course } from '../types'
import {
  twoProcesses,
  py4j,
  dataframeIllusion,
  theUdfCrossing,
  theRoundTrip,
  theMemoryProblem,
  codegenLost,
  arrow,
  pandasUdfs,
  iteratorAndMap,
  theDecision,
} from './sections'

// Course 8 of the spine — the course that exists because of one figure. COURSE-PLAN.md §2 rates the
// Databricks excerpt's p.123 diagram (driver, three executors, each JVM paired with a worker Python
// process) the best drawing in the document, and notes the spine had no home for the Python↔JVM
// boundary until the figures were looked at.
//
// The arc reduces every PySpark performance question to one: does a row have to leave the JVM? §§2–3
// are the two crossings that do NOT cost (Py4J, and pure DataFrame code). §§4–7 are the one that
// does, and its three separate costs — transport, unmanaged memory, and the fusion it breaks around
// itself. §§8–10 are the fix, and §11 is the decision procedure.
export const pysparkBoundary: Course = {
  id: 'pyspark-boundary',
  title: 'Why your PySpark UDF is slow',
  sections: [
    twoProcesses,
    py4j,
    dataframeIllusion,
    theUdfCrossing,
    theRoundTrip,
    theMemoryProblem,
    codegenLost,
    arrow,
    pandasUdfs,
    iteratorAndMap,
    theDecision,
  ],
}
