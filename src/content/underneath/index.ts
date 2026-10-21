import type { Course } from '../types'
import { rddsAndLineage } from './01-rdds-and-lineage'
import { pairRdds } from './02-pair-rdds'
import { closuresBroadcastAccumulators } from './03-closures-broadcast-accumulators'
import { choosingAnAbstraction } from './04-choosing-an-abstraction'

export const underneath: Course = {
  id: 'underneath',
  title: 'Look underneath: RDDs',
  sections: [rddsAndLineage, pairRdds, closuresBroadcastAccumulators, choosingAnAbstraction],
}
