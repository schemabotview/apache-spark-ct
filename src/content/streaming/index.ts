import type { Course } from '../types'
import {
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
} from './sections'

// Course 13 of the spine. The through-line is that Structured Streaming is not a second engine — it
// is the batch engine run incrementally over a table that keeps growing. §§1–4 are that claim and
// its machinery, ending on the one genuinely new thing it introduces: state. §§5–7 are the
// durability that makes it trustworthy — and §7 is explicit that exactly-once needs the sink's
// cooperation, which Spark cannot supply. §§8–12 are the other new problem: time, and the state
// that tracking time requires.
//
// Learning Spark 1E is deliberately unused here: its streaming chapter is DStreams, which
// Structured Streaming replaced. See COURSE-PLAN.md.
export const streaming: Course = {
  id: 'streaming',
  title: 'How Structured Streaming actually works',
  sections: [
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
  ],
}
