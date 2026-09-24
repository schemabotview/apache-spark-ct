import type { Scene } from '@graphlearning/flow'

// Course 8 (pyspark-boundary) scenes.
//
// This course exists because of one figure. COURSE-PLAN.md §2 rates the Databricks excerpt's p.123
// diagram — driver holding a Scala UDF and a Python UDF, three executors, each JVM paired with a
// worker Python process, three numbered steps — as the best drawing in the whole document, and notes
// that the spine had no home for the Python↔JVM boundary until it was looked at.
//
// PAIRED-PROCESS NESTING is the second diagram class COURSE-PLAN.md flagged as unproven. VERDICT,
// from the rendered frames on 2026-09-24: it works, and better than an edge-drawn version would.
// The engine renders a parent with children as a containing box, so an executor holding a JVM child
// and a Python child reads immediately as "these two are on the same machine" — the containment IS
// the claim. Colour carries the rest: the JVM `network`, the Python worker `warn`, so the expensive
// half of the pair is visible before any text is read. §1 and §4 both use it.

import { twoProcesses } from './two-processes'
import { py4j } from './py4j'
import { dataframeIllusion } from './dataframe-illusion'
import { theUdfCrossing } from './the-udf-crossing'
import { theRoundTrip } from './the-round-trip'
import { theMemoryProblem } from './the-memory-problem'
import { codegenLost } from './codegen-lost'
import { arrow } from './arrow'
import { pandasUdfs } from './pandas-udfs'
import { iteratorAndMap } from './iterator-and-map'
import { theDecision } from './the-decision'

export const pysparkBoundaryScenes: Scene[] = [
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
]
