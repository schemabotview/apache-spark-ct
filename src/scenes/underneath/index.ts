import type { Scene } from '@graphlearning/flow'
import { rddLineage } from './lineage'
import { pairRdds } from './pairs'
import { closuresShared } from './closures'
import { chooseAbstraction } from './choose'

export const underneathScenes: Scene[] = [rddLineage, pairRdds, closuresShared, chooseAbstraction]
