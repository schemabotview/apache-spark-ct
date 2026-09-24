import type { Scene } from '@graphlearning/flow'

// Course 11 (memory) scenes. The course answers "where did my memory go" and "why did my cache
// vanish" — and both answers come from the same place: one shared pool with an asymmetric borrow
// rule. §§1–3 establish that; §§4–8 are caching, which is the half people think they understand;
// §§9–11 are what happens when it does not fit.

import { theExecutorBudget } from './the-executor-budget'
import { storageVsExecution } from './storage-vs-execution'
import { whoWins } from './who-wins'
import { oneParentThreeChildren } from './one-parent-three-children'
import { cacheVsPersist } from './cache-vs-persist'
import { storageLevels } from './storage-levels'
import { whatEvictionDoes } from './what-eviction-does'
import { checkpoint } from './checkpoint'
import { spill } from './spill'
import { offHeap } from './off-heap'
import { readingTheStorageTab } from './reading-the-storage-tab'

export const memoryScenes: Scene[] = [
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
]
