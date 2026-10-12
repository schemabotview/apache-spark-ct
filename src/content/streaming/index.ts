import type { Course } from '../types'
import { boundedVsUnbounded } from './01-bounded-vs-unbounded'
import { streamingArchitecture } from './02-streaming-architecture'
import { sourcesAndSinks } from './03-sources-and-sinks'
import { triggers } from './04-triggers'
import { eventVsProcessingTime } from './05-event-vs-processing-time'
import { windowsAndLateData } from './06-windows-and-late-data'
import { watermarks } from './07-watermarks'
import { stateGrowth } from './08-state-growth'
import { outputModes } from './09-output-modes'
import { streamingJoins } from './10-streaming-joins'
import { checkpointing } from './11-checkpointing'
import { deliveryGuarantees } from './12-delivery-guarantees'
import { workedTimelines } from './13-worked-timelines'

// Chapter 7 of docs/APACHE-SPARK-COURSE-PLAN.md — one section per numbered item, in plan order.
// The worked events are the chapter's ten order events (four files, 2026-10-01 09:01–09:33), read
// by the file source with availableNow and a 10-minute watermark on PySpark 4.0.1.
export const streaming: Course = {
  id: 'streaming',
  title: 'Structured Streaming and Stateful Processing',
  sections: [
    boundedVsUnbounded,
    streamingArchitecture,
    sourcesAndSinks,
    triggers,
    eventVsProcessingTime,
    windowsAndLateData,
    watermarks,
    stateGrowth,
    outputModes,
    streamingJoins,
    checkpointing,
    deliveryGuarantees,
    workedTimelines,
  ],
}
