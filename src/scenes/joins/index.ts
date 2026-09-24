import type { Scene } from '@graphlearning/flow'
import { theProblem } from './the-problem'
import { broadcastJoin } from './broadcast-join'
import { threshold } from './threshold'
import { sortMerge } from './sort-merge'
import { shuffleHash } from './shuffle-hash'
import { nestedLoop } from './nested-loop'
import { howSparkChooses } from './how-spark-chooses'
import { joinTypes } from './join-types'
import { bucketing } from './bucketing'
import { skewedJoins } from './skewed-joins'
import { hints } from './hints'

// Course 9 (joins) scenes. §§1–6 are the five strategies, which share a vocabulary (build side,
// probe side, stream side) and are only honest read against each other; §§7–11 are the decision and
// what you do about it.
export const joinsScenes: Scene[] = [
  theProblem,
  broadcastJoin,
  threshold,
  sortMerge,
  shuffleHash,
  nestedLoop,
  howSparkChooses,
  joinTypes,
  bucketing,
  skewedJoins,
  hints,
]
