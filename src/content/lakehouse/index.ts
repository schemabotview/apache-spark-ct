import type { Course } from '../types'
import {
  folderIsNotATable,
  thePartialWrite,
  theListingProblem,
  theTransactionLog,
  aCommit,
  snapshotIsolation,
  timeTravel,
  schemaEnforcement,
  updatesAndDeletes,
  compaction,
  vacuum,
  theThree,
} from './sections'

// Course 14 of the spine — the closer, and the one that answers the gap course 1 §7 opened: Spark
// deliberately owns no storage, and no owner means no guarantees. §§1–3 are the three problems that
// follow (nothing is atomic, a failed write is indistinguishable from a finished one, and listing is
// expensive). §4 is the fix, and it is one idea: write down which files count. §§5–11 are what falls
// out of that idea — none of them a separate feature, all of them consequences. §12 names the three
// implementations and is honest that the mechanism matters and the choice rarely does.
//
// COURSE-PLAN.md §5 flags this as a single-derived-source course: the only coverage in the four
// books is one chapter of the 2E study notes. Grounded against the Delta and Iceberg specs, and
// deliberately teaching the mechanism rather than any one vendor's product.
export const lakehouse: Course = {
  id: 'lakehouse',
  title: 'Why a folder of Parquet is not a table',
  sections: [
    folderIsNotATable,
    thePartialWrite,
    theListingProblem,
    theTransactionLog,
    aCommit,
    snapshotIsolation,
    timeTravel,
    schemaEnforcement,
    updatesAndDeletes,
    compaction,
    vacuum,
    theThree,
  ],
}
