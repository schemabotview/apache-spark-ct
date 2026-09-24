import type { Course } from '../types'
import { whyAShuffle } from './01-why-a-shuffle'
import { theStageCut } from './02-the-stage-cut'
import { mapSideWrite } from './03-map-side-write'
import { theExchange } from './04-the-exchange'
import { reduceSideFetch } from './05-reduce-side-fetch'
import { partitionCount } from './06-partition-count'
import { skew } from './07-skew'
import { avoidingIt } from './08-avoiding-it'
import { aqeFixesIt } from './09-aqe-fixes-it'
import { readingTheUi } from './10-reading-the-ui'

// Course 5 of the spine — the flagship, and the first authored. The arc is deliberately one
// argument rather than ten topics: a wide dependency forces rows to meet (§1), that meeting is what
// stages are cut at (§2), the map side writes files rather than sending them (§3), those files
// outlive their executor (§4), and the reduce side is where the memory goes (§5). Only then the
// three things people actually search for — the partition count (§6), skew (§7), and how to avoid
// the shuffle entirely (§8) — followed by what Spark 3 now does for you (§9) and how to read it in
// the UI (§10).
//
// §§1–2 re-define narrow/wide and the stage boundary inside this course rather than leaning on
// courses 3 and 4. That is deliberate: every course publishes as a standalone search-first video, so
// a viewer arriving here from a search has no prior course. See ../index.ts on why no narration in
// this repo may cross-reference a module by number.
export const shuffle: Course = {
  id: 'shuffle',
  title: 'How the Spark shuffle works',
  sections: [
    whyAShuffle,
    theStageCut,
    mapSideWrite,
    theExchange,
    reduceSideFetch,
    partitionCount,
    skew,
    avoidingIt,
    aqeFixesIt,
    readingTheUi,
  ],
}
