import type { Scene } from '@graphlearning/flow'
import { baselineMeasure } from './baseline-measure'
import { stageMetrics } from './stage-metrics'
import { resourceSymptoms } from './resource-symptoms'
import { partitionSizing } from './partition-sizing'
import { shuffleControl } from './shuffle-control'
import { joinChoice } from './join-choice'
import { skewDetect } from './skew-detect'
import { cacheTradeoff } from './cache-tradeoff'
import { layoutPruning } from './layout-pruning'
import { aqeRuntime } from './aqe-runtime'
import { executorResources } from './executor-resources'
import { beforeAfter } from './before-after'

// One bundle per course folder, spread into src/scenes/index.ts.
export const performanceScenes: Scene[] = [
  baselineMeasure,
  stageMetrics,
  resourceSymptoms,
  partitionSizing,
  shuffleControl,
  joinChoice,
  skewDetect,
  cacheTradeoff,
  layoutPruning,
  aqeRuntime,
  executorResources,
  beforeAfter,
]
