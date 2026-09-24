import type { Scene } from '@graphlearning/flow'

// Course 2 (topology) scenes. The question is "what is actually running, and where" — so every scene
// is a box diagram of processes, and the through-line is that a Spark application is three kinds of
// process with a strict division of labour. The deploy-mode sections all vary ONE thing (where the
// driver lands) against a fixed backdrop, which is what makes them comparable.
//
// Written to the layout limits enforced by scripts/lint-scenes.mjs.

import { threeProcesses } from './three-processes'
import { theDriver } from './the-driver'
import { sparkSession } from './spark-session'
import { executors } from './executors'
import { clusterManager } from './cluster-manager'
import { localMode } from './local-mode'
import { clientVsCluster } from './client-vs-cluster'
import { onKubernetes } from './on-kubernetes'
import { sparkSubmit } from './spark-submit'
import { failureModes } from './failure-modes'

export const topologyScenes: Scene[] = [
  threeProcesses,
  theDriver,
  sparkSession,
  executors,
  clusterManager,
  localMode,
  clientVsCluster,
  onKubernetes,
  sparkSubmit,
  failureModes,
]
