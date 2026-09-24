import type { Course } from '../types'
import {
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
} from './sections'

// Course 3 of the spine — the abstraction everything else is built on, argued as a much smaller idea
// than its reputation: five properties (§1), and every famous Spark behaviour falls out of one of
// them. The course then walks the list — the partition as the unit of parallelism, placement and
// recovery (§2); immutability as the thing that makes recomputation correct (§3); lineage as the
// backup (§4); the two dependency kinds and what each buys or takes back (§§5–6); the fault-tolerance
// trade stated plainly (§7); locality (§8); and the key (§9). §10 is honest about the answer being
// "use DataFrames" — this course is for understanding the layer, not for writing at it.
//
// Learning Spark 1E is the source that earns its place here: chs. 3–4 remain the clearest account of
// partitions, lineage and narrow-vs-wide dependency in any of the four books.
export const rdd: Course = {
  id: 'rdd',
  title: 'What an RDD actually is',
  sections: [
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
  ],
}
