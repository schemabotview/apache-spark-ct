import type { Scene } from '@graphlearning/flow'
import { schemaEnforcement } from './schema-enforcement'
import { malformedAndNulls } from './malformed-and-nulls'
import { ansiCasts } from './ansi-casts'
import { joinAmplification } from './join-amplification'
import { windowFunctions } from './window-functions'
import { timestampsTimeZones } from './timestamps-time-zones'
import { nestedData } from './nested-data'
import { udfBoundary } from './udf-boundary'
import { edgeCasePipeline } from './edge-case-pipeline'

// One bundle per course folder, spread into src/scenes/index.ts.
export const correctnessScenes: Scene[] = [
  schemaEnforcement,
  malformedAndNulls,
  ansiCasts,
  joinAmplification,
  windowFunctions,
  timestampsTimeZones,
  nestedData,
  udfBoundary,
  edgeCasePipeline,
]
