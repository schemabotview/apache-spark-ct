import type { Course } from '../types'
import {
  staticPlanProblem,
  materializationPoints,
  theLoop,
  coalescePartitions,
  strategySwitch,
  skewSplit,
  dynamicPartitionPruning,
  dppVsStatic,
  whatItDoesNotFix,
  seeingIt,
} from './sections'

// Course 12 of the spine — and the one COURSE-PLAN.md §5 rates the sharpest risk in it. The only
// source in the four books is the 2E study notes, which describe Spark 3.0.0-preview2, and
// skew-join handling changed after that release. Everything here is stated against current Spark
// (3.2+) defaults. The most consequential difference: `spark.sql.adaptive.enabled` has been TRUE by
// default since 3.2, which the notes predate — so the advice is no longer "turn this on" but "know
// what it is already doing to your query".
//
// The arc: why a static plan is wrong deterministically rather than occasionally (§1), the one
// moment the guessing could stop (§2), the loop that uses it (§3), the three re-plans (§§4–6), DPP
// and why it is NOT part of AQE despite arriving alongside it (§§7–8), the limits (§9), and how to
// read what it decided — which requires knowing that explain() before running shows a guess (§10).
export const aqe: Course = {
  id: 'aqe',
  title: 'How Spark re-plans your query while it runs',
  sections: [
    staticPlanProblem,
    materializationPoints,
    theLoop,
    coalescePartitions,
    strategySwitch,
    skewSplit,
    dynamicPartitionPruning,
    dppVsStatic,
    whatItDoesNotFix,
    seeingIt,
  ],
}
