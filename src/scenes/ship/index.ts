import type { Scene } from '@graphlearning/flow'
import { submitConfig } from './package'
import { deployModes } from './where'
import { clusterManagers } from './standalone'
import { capacityPlan } from './capacity'
import { qualityChecks } from './tests'
import { observabilityPath } from './history'
import { retrySideEffects } from './retries'
import { tableFormatBoundary } from './overwrite'
import { backfillOverwrite } from './backfill'
import { securitySurface } from './secrets'
import { productionReview } from './release'

export const shipScenes: Scene[] = [submitConfig, deployModes, clusterManagers, capacityPlan, qualityChecks, observabilityPath, retrySideEffects, tableFormatBoundary, backfillOverwrite, securitySurface, productionReview]
