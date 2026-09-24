import type { Course } from '../types'
import { theProblem } from './01-the-problem'
import { broadcastHashJoin } from './02-broadcast-hash-join'
import { theThreshold } from './03-the-threshold'
import { sortMergeJoin } from './04-sort-merge-join'
import { shuffleHashJoin } from './05-shuffle-hash-join'
import { nestedLoopJoin } from './06-nested-loop'
import { howSparkChooses } from './07-how-spark-chooses'
import { joinTypesCost } from './08-join-types-cost'
import { bucketingSection } from './09-bucketing'
import { skewedJoinsSection } from './10-skewed-joins'
import { hintsSection } from './11-hints'

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
