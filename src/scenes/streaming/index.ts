import type { Scene } from '@graphlearning/flow'
import { incrementalQuery } from './incremental-query'
import { streamingEngine } from './streaming-engine'
import { sourcesSinks } from './sources-sinks'
import { triggerModes } from './trigger-modes'
import { eventVsArrival } from './event-vs-arrival'
import { windowTimeline } from './window-timeline'
import { watermarkAppend } from './watermark-append'
import { stateGrowth } from './state-growth'
import { outputModes } from './output-modes'
import { streamingJoins } from './streaming-joins'
import { checkpointRestart } from './checkpoint-restart'
import { deliveryGuarantees } from './delivery-guarantees'
import { recoveryTimeline } from './recovery-timeline'

// One bundle per course folder, spread into src/scenes/index.ts.
export const streamingScenes: Scene[] = [
  incrementalQuery,
  streamingEngine,
  sourcesSinks,
  triggerModes,
  eventVsArrival,
  windowTimeline,
  watermarkAppend,
  stateGrowth,
  outputModes,
  streamingJoins,
  checkpointRestart,
  deliveryGuarantees,
  recoveryTimeline,
]
