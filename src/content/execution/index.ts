import type { Course } from '../types'
import {
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
} from './sections'

// Course 4 of the spine — how a line of code becomes work on a cluster. The arc: nothing happens
// when you write a transformation (§1), an action is what turns the description into a job (§2), and
// the waiting is what makes optimisation possible (§3). Then the four units and what bounds each
// (§4), the boundary that creates them (§5), the fusion that happens between boundaries (§6), the
// task as the unit that fails (§7), and the slot arithmetic (§8). §9 separates the two schedulers,
// §10 walks one real query end to end, and §11 is how to check any of it without running anything.
export const execution: Course = {
  id: 'execution',
  title: 'How a Spark job becomes stages and tasks',
  sections: [
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
  ],
}
