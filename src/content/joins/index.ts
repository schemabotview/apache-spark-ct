import type { Course } from '../types'
import { theProblem, broadcastHashJoin, theThreshold, sortMergeJoin, shuffleHashJoin, nestedLoopJoin } from './01-06'
import { howSparkChooses, joinTypesCost, bucketingSection, skewedJoinsSection, hintsSection } from './07-11'

// Course 9 of the spine — second authored, after `shuffle`. The arc is a single question asked five
// ways: matching rows live on different machines, so either one side moves whole (§2–3) or both move
// by key (§4–5), and when there is no equality to move by, neither works (§6). Only then the thing
// people actually came for: how Spark picks (§7), what the join TYPE costs on top (§8), and the
// three levers — bucketing (§9), skew (§10), hints (§11).
//
// §1 re-derives the problem from scratch rather than leaning on course 5. Deliberate: every course
// publishes as a standalone search-first video, so a viewer arriving from a search has no prior
// course. The shuffle is re-explained in a sentence wherever it is needed, never cross-referenced by
// module number — see ../index.ts.
export const joins: Course = {
  id: 'joins',
  title: 'How Spark decides to join',
  sections: [
    theProblem,
    broadcastHashJoin,
    theThreshold,
    sortMergeJoin,
    shuffleHashJoin,
    nestedLoopJoin,
    howSparkChooses,
    joinTypesCost,
    bucketingSection,
    skewedJoinsSection,
    hintsSection,
  ],
}
