import type { Scene } from '@graphlearning/flow'

// Course 14 (lakehouse) scenes — the spine's closer, and the one that answers the gap course 1 §7
// opened: Spark deliberately owns no storage, and "no owner means no guarantees".
//
// COURSE-PLAN.md §5 flags this as a single-derived-source course: the only coverage in the four
// books is one chapter of the 2E study notes. Grounded against the Delta and Iceberg specifications.
// The course deliberately teaches the MECHANISM (a log beside the data) rather than any one vendor's
// product, and §12 is honest about what actually differs between the three.

import { folderIsNotATable } from './folder-is-not-a-table'
import { thePartialWrite } from './the-partial-write'
import { theListingProblem } from './the-listing-problem'
import { theTransactionLog } from './the-transaction-log'
import { aCommit } from './a-commit'
import { snapshotIsolation } from './snapshot-isolation'
import { timeTravel } from './time-travel'
import { schemaEnforcement } from './schema-enforcement'
import { updatesAndDeletes } from './updates-and-deletes'
import { compaction } from './compaction'
import { vacuum } from './vacuum'
import { theThree } from './the-three'

export const lakehouseScenes: Scene[] = [
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
]
