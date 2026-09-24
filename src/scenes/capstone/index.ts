import type { Scene } from '@graphlearning/flow'

// Course 15 (capstone) scenes — ported from the `apache-spark` repo on 2026-09-24, where this course
// closed a five-course applied arc. Two things changed in the port and both are invariants here:
// scene ids are course-prefixed (`cap-*`), and the code-card bodies are strict ASCII like every other
// code scene in this repo.
//
// Shape: the `cap-lambda-arch` master map carries the two bookends (§1 the-plan, §13 closer); each of
// the 11 build sections in between carries its own stage CODE card, at `minCols: 76` so the whole
// course renders at one type size shot to shot. That padding is deliberate and not the engine's 64
// default — Spark's API surface runs wide.

import { lambdaArch } from './lambda-arch'
import { capReadLake } from './read-lake'
import { capClean } from './clean'
import { capAggregate } from './aggregate'
import { capWrite } from './write'
import { capIngest } from './ingest'
import { capEnrich } from './enrich'
import { capWindow } from './window'
import { capRealTimeView } from './real-time-view'
import { capServing } from './serving'
import { capDeploy } from './deploy'
import { capTune } from './tune'

export const capstoneScenes: Scene[] = [
  lambdaArch,
  capReadLake,
  capClean,
  capAggregate,
  capWrite,
  capIngest,
  capEnrich,
  capWindow,
  capRealTimeView,
  capServing,
  capDeploy,
  capTune,
]
