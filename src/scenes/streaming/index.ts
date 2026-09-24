import type { Scene } from '@graphlearning/flow'

// Course 13 (streaming) scenes. The through-line is that Structured Streaming is not a second
// engine — it is the batch engine run incrementally over a table that keeps growing. So §§1–4 are
// that claim and its machinery, §§5–7 are the durability that makes it trustworthy, and §§8–12 are
// the one genuinely new problem: time, and the state that keeping track of time requires.
//
// Learning Spark 1E is deliberately ignored as a source for this course: its streaming chapter is
// DStreams, which Structured Streaming replaced.

import { theUnboundedTable } from './the-unbounded-table'
import { theSameEngine } from './the-same-engine'
import { theTrigger } from './the-trigger'
import { incrementalExecution } from './incremental-execution'
import { theOffsetLog } from './the-offset-log'
import { outputModes } from './output-modes'
import { sinksAndIdempotence } from './sinks-and-idempotence'
import { eventTime } from './event-time'
import { windows } from './windows'
import { watermarks } from './watermarks'
import { theStateStore } from './the-state-store'
import { streamStreamJoins } from './stream-stream-joins'

export const streamingScenes: Scene[] = [
  theUnboundedTable,
  theSameEngine,
  theTrigger,
  incrementalExecution,
  theOffsetLog,
  outputModes,
  sinksAndIdempotence,
  eventTime,
  windows,
  watermarks,
  theStateStore,
  streamStreamJoins,
]
