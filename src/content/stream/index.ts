import type { Course } from '../types'
import { boundedAndUnbounded } from './01-bounded-and-unbounded'
import { theStreamingEngine } from './02-the-streaming-engine'
import { sourcesAndSinks } from './03-sources-and-sinks'
import { triggers } from './04-triggers'
import { eventTimeAndProcessingTime } from './05-event-time-and-processing-time'
import { windowsAndLateData } from './06-windows-and-late-data'
import { watermarks } from './07-watermarks'
import { stateAndItsGrowth } from './08-state-and-its-growth'
import { outputModes } from './09-output-modes'
import { streamStaticAndStreamStreamJoins } from './10-stream-static-and-stream-stream-joins'
import { checkpointsAndRestarts } from './11-checkpoints-and-restarts'
import { deliveryGuarantees } from './12-delivery-guarantees'
import { theWholeTimeline } from './13-the-whole-timeline'

export const stream: Course = {
  id: 'stream',
  title: 'Make it continuous',
  sections: [boundedAndUnbounded, theStreamingEngine, sourcesAndSinks, triggers, eventTimeAndProcessingTime, windowsAndLateData, watermarks, stateAndItsGrowth, outputModes, streamStaticAndStreamStreamJoins, checkpointsAndRestarts, deliveryGuarantees, theWholeTimeline],
}
