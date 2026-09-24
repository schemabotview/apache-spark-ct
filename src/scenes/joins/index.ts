import type { Scene } from '@graphlearning/flow'
import { theProblem, broadcastJoin, threshold, sortMerge, shuffleHash, nestedLoop } from './strategies'
import { howSparkChooses, joinTypes, bucketing, skewedJoins, hints } from './decisions'

// Course 9 (joins) scenes — eleven, in two files rather than eleven: §§1–6 are the strategies and
// share a vocabulary (build side, probe side, stream side), §§7–11 are the decision and what you do
// about it. Splitting them that way keeps each file readable as one argument.
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
