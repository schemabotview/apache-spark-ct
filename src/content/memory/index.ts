import type { Course } from '../types'
import {
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
} from './sections'

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
