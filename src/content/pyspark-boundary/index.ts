import type { Course } from '../types'
import { twoProcesses } from './01-two-processes'
import { py4j } from './02-py4j'
import { dataframeIllusion } from './03-the-dataframe-illusion'
import { theUdfCrossing } from './04-the-udf-crossing'
import { theRoundTrip } from './05-the-round-trip'
import { theMemoryProblem } from './06-the-memory-problem'
import { codegenLost } from './07-codegen-lost'
import { arrow } from './08-arrow'
import { pandasUdfs } from './09-pandas-udfs'
import { iteratorAndMap } from './10-iterator-and-map'
import { theDecision } from './11-the-decision'

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
