import type { Course } from '../types'
import { schemaEvolution } from './01-schema-enforcement-and-evolution'
import { nullAndMalformed } from './02-null-and-malformed-records'
import { castsAndAnsi } from './03-casts-and-ansi-mode'
import { joinCardinality } from './04-join-cardinality'
import { windowFunctions } from './05-window-functions'
import { datesTimestamps } from './06-dates-timestamps-and-time-zones'
import { nestedData } from './07-nested-data'
import { builtinsAndUdfs } from './08-built-ins-and-python-udfs'
import { theInvariants } from './09-the-invariants'

export const correct: Course = {
  id: 'correct',
  title: 'Make it correct',
  sections: [schemaEvolution, nullAndMalformed, castsAndAnsi, joinCardinality, windowFunctions, datesTimestamps, nestedData, builtinsAndUdfs, theInvariants],
}
