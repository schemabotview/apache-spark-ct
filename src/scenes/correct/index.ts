import type { Scene } from '@graphlearning/flow'
import { schemaEvolution } from './schema-evolution'
import { malformedRecords } from './malformed'
import { castsAnsi } from './casts'
import { joinCardinality } from './joins'
import { windowLatest } from './windows'
import { shopDay } from './timezones'
import { nestedData } from './nested'
import { udfBoundary } from './udfs'
import { qualityInvariants } from './quality'

export const correctScenes: Scene[] = [schemaEvolution, malformedRecords, castsAnsi, joinCardinality, windowLatest, shopDay, nestedData, udfBoundary, qualityInvariants]
