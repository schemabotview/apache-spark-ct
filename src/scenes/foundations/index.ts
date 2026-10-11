import type { Scene } from '@graphlearning/flow'
import { localDailySummary } from './local-daily-summary'
import { scaleUpVsOut } from './scale-up-vs-out'
import { partitionsLocality } from './partitions-locality'
import { mapreduceVsSpark } from './mapreduce-vs-spark'
import { retailPipeline } from './retail-pipeline'

// One bundle per course folder, spread into src/scenes/index.ts.
export const foundationsScenes: Scene[] = [
  localDailySummary,
  scaleUpVsOut,
  partitionsLocality,
  mapreduceVsSpark,
  retailPipeline,
]
