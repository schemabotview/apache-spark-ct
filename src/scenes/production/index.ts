import type { Scene } from '@graphlearning/flow'
import { submitConfig } from './submit-config'
import { deployModes } from './deploy-modes'
import { clusterManagers } from './cluster-managers'
import { capacityPlan } from './capacity-plan'
import { qualityChecks } from './quality-checks'
import { observabilityPath } from './observability-path'
import { retrySideEffects } from './retry-side-effects'
import { tableFormatBoundary } from './table-format-boundary'
import { backfillOverwrite } from './backfill-overwrite'
import { securitySurface } from './security-surface'
import { productionReview } from './production-review'

// One bundle per course folder, spread into src/scenes/index.ts.
export const productionScenes: Scene[] = [
  submitConfig,
  deployModes,
  clusterManagers,
  capacityPlan,
  qualityChecks,
  observabilityPath,
  retrySideEffects,
  tableFormatBoundary,
  backfillOverwrite,
  securitySurface,
  productionReview,
]
