import type { Scene } from '@graphlearning/flow'

// Course 1 (origins) scenes. Reading them in sequence is how the argument stays honest: a hardware
// limit forces distribution, MapReduce
// answers it with a disk round-trip per step, the round-trip forces a zoo of specialist engines, and
// Spark's bet is that removing the round-trip collapses the zoo back into one engine.
//
// Written to the layout limits enforced by scripts/lint-scenes.mjs — see ../shuffle/index.ts.

import { theSingleMachine } from './the-single-machine'
import { shipCodeToData } from './ship-code-to-data'
import { theDiskTax } from './the-disk-tax'
import { theEngineZoo } from './the-engine-zoo'
import { theBet } from './the-bet'
import { oneEngine } from './one-engine'
import { computeNotStorage } from './compute-not-storage'
import { theTimeline } from './the-timeline'

export const originsScenes: Scene[] = [
  theSingleMachine,
  shipCodeToData,
  theDiskTax,
  theEngineZoo,
  theBet,
  oneEngine,
  computeNotStorage,
  theTimeline,
]
