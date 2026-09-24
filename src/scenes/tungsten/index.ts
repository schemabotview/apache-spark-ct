import type { Scene } from '@graphlearning/flow'

// Course 7 (tungsten) scenes. The question is why a DataFrame beats hand-written RDD code, and the
// answer is two separate things people conflate: a different MEMORY LAYOUT (§§1–5) and a different
// EXECUTION SHAPE (§§6–8). Keeping those apart is most of what this course is for.
//
// COURSE-PLAN.md flags this course as thin in the sources — the Databricks excerpt never mentions
// Tungsten at all, and SDG covers it in passing. Grounded against the Spark documentation.

import { theObjectTax } from './the-object-tax'
import { theBinaryRow } from './the-binary-row'
import { offHeap } from './off-heap'
import { encoders } from './encoders'
import { cacheLocality } from './cache-locality'
import { virtualCallProblem } from './virtual-call-problem'
import { wholeStageCodegen } from './whole-stage-codegen'
import { seeingIt } from './seeing-it'
import { whereItStops } from './where-it-stops'
import { memoryEras } from './memory-eras'

export const tungstenScenes: Scene[] = [
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
]
