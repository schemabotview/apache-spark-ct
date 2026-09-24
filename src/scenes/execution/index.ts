import type { Scene } from '@graphlearning/flow'

// Course 4 (execution) scenes. The question is how a line of code becomes work on a cluster, and the
// answer is a chain of four units — job, stage, task, slot — each bounded by a different thing. The
// scenes are built so the same four keep reappearing in the same order, because the course's value
// is in being able to name which one you are looking at in the UI.

import { nothingHappensYet } from './nothing-happens-yet'
import { theAction } from './the-action'
import { whyLazyPays } from './why-lazy-pays'
import { jobStageTask } from './job-stage-task'
import { theStageCut } from './the-stage-cut'
import { pipelining } from './pipelining'
import { theTask } from './the-task'
import { slots } from './slots'
import { dagScheduler } from './dag-scheduler'
import { aRealLineage } from './a-real-lineage'
import { readingExplain } from './reading-explain'

export const executionScenes: Scene[] = [
  nothingHappensYet,
  theAction,
  whyLazyPays,
  jobStageTask,
  theStageCut,
  pipelining,
  theTask,
  slots,
  dagScheduler,
  aRealLineage,
  readingExplain,
]
