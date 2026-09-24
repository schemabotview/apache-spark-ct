import type { Course } from '../types'
import { theExecutorBudget } from './01-the-executor-budget'
import { storageVsExecution } from './02-storage-vs-execution'
import { whoWins } from './03-who-wins'
import { oneParentThreeChildren } from './04-one-parent-three-children'
import { cacheVsPersist } from './05-cache-vs-persist'
import { storageLevels } from './06-storage-levels'
import { whatEvictionDoes } from './07-what-eviction-does'
import { checkpoint } from './08-checkpoint'
import { spill } from './09-spill'
import { offHeap } from './10-off-heap'
import { readingTheStorageTab } from './11-reading-the-storage-tab'

// Course 11 of the spine — "where did my memory go" and "why did my cache vanish", which turn out to
// be the same question. §§1–3 are the budget and the asymmetric borrow rule that answers both: a
// cache is the thing Spark is willing to lose, because lineage can rebuild it and a half-built hash
// table cannot. §§4–8 are caching, argued from the one shape where it reliably pays. §§9–11 are what
// happens when it does not fit.
export const memory: Course = {
  id: 'memory',
  title: 'Where Spark’s memory actually goes',
  sections: [
    theExecutorBudget,
    storageVsExecution,
    whoWins,
    oneParentThreeChildren,
    cacheVsPersist,
    storageLevels,
    whatEvictionDoes,
    checkpoint,
    spill,
    offHeap,
    readingTheStorageTab,
  ],
}
