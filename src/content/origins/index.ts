import type { Course } from '../types'
import { theSingleMachine } from './01-the-single-machine'
import { shipCodeToData } from './02-ship-code-to-data'
import { theDiskTax } from './03-the-disk-tax'
import { theEngineZoo } from './04-the-engine-zoo'
import { theBet } from './05-the-bet'
import { oneEngine } from './06-one-engine'
import { computeNotStorage } from './07-compute-not-storage'
import { theTimeline } from './08-the-timeline'

// Course 1 of the spine — the concept's front door. The arc is one causal chain, not a history
// lesson: clock speed stalls (§1), so work must be distributed, which only works if you ship the
// code to the data (§2); MapReduce does that but pays a disk round-trip per step (§3), which is why
// a zoo of specialist engines grew around it (§4). Spark's bet keeps the parallelism and the fault
// tolerance and removes only the round-trip (§5) — and that single change is what collapses the zoo
// back into libraries over one core (§6). §7 is the deliberate omission that outlived Hadoop, and
// §8 places the viewer in the third of three eras.
export const origins: Course = {
  id: 'origins',
  title: 'Why Spark exists',
  sections: [
    theSingleMachine,
    shipCodeToData,
    theDiskTax,
    theEngineZoo,
    theBet,
    oneEngine,
    computeNotStorage,
    theTimeline,
  ],
}
