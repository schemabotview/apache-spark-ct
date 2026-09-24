import type { Scene } from '@graphlearning/flow'

// Course 12 (aqe) scenes.
//
// COURSE-PLAN.md §5 rates this the SHARPEST RISK in the whole spine: the only source in the four
// books is the 2E study notes, which describe Spark 3.0.0-preview2, and skew-join handling changed
// after that release. Everything here is stated against current Spark (3.2+) defaults — in
// particular `spark.sql.adaptive.enabled` has been TRUE by default since 3.2, which the 2E notes
// predate and which changes the advice from "turn this on" to "know what it is already doing".

import { staticPlanProblem } from './static-plan-problem'
import { materializationPoints } from './materialization-points'
import { theLoop } from './the-loop'
import { coalescePartitions } from './coalesce-partitions'
import { strategySwitch } from './strategy-switch'
import { skewSplit } from './skew-split'
import { dynamicPartitionPruning } from './dynamic-partition-pruning'
import { dppVsStatic } from './dpp-vs-static'
import { whatItDoesNotFix } from './what-it-does-not-fix'
import { seeingIt } from './seeing-it'

export const aqeScenes: Scene[] = [
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
]
