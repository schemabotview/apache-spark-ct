import type { Scene } from '@graphlearning/flow'

// Course 3 (rdd) scenes. The RDD is the abstraction everything else in Spark is built on, and the
// course's job is to show that it is a much smaller idea than its reputation: five properties, and
// every famous Spark behaviour falls out of one of them. So the scenes keep returning to that list.
//
// This is the course where Learning Spark 1E earns its place as a source — its chapters 3 and 4 are
// still the clearest account of partitions, lineage and narrow-vs-wide dependency in any of the four.

import { fiveProperties } from './five-properties'
import { thePartition } from './the-partition'
import { immutability } from './immutability'
import { lineage } from './lineage'
import { narrowDependency } from './narrow-dependency'
import { wideDependency } from './wide-dependency'
import { recomputeNotReplicate } from './recompute-not-replicate'
import { preferredLocations } from './preferred-locations'
import { pairRdds } from './pair-rdds'
import { whenRddsWin } from './when-rdds-win'

export const rddScenes: Scene[] = [
  fiveProperties,
  thePartition,
  immutability,
  lineage,
  narrowDependency,
  wideDependency,
  recomputeNotReplicate,
  preferredLocations,
  pairRdds,
  whenRddsWin,
]
