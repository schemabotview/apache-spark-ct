import type { Scene } from '@graphlearning/flow'

// Course 6 (catalyst) scenes.
//
// THIS IS THE COURSE THE REPO EXISTS TO MAKE ITS CASE WITH. See COURSE-PLAN.md §2: the canonical
// Databricks figures of this exact pipeline (excerpt pp. 51–53) draw every plan node as an EMPTY
// BOX. They show the shape — unresolved → resolved → optimized → physical — and never what actually
// changed at each step, which is the only interesting part.
//
// So every scene from §3 to §9 carries the REAL plan nodes (Relation, Filter, Project, Join,
// Aggregate) with their actual contents, and names the rule that fired between one frame and the
// next. That is the whole differentiation, and it is checkable on the frames.

import { oneFrontDoor } from './one-front-door'
import { expressionTree } from './expression-tree'
import { unresolvedPlan } from './unresolved-plan'
import { theCatalog } from './the-catalog'
import { theAnalyzer } from './the-analyzer'
import { rulesToFixpoint } from './rules-to-fixpoint'
import { predicatePushdown } from './predicate-pushdown'
import { columnPruning } from './column-pruning'
import { physicalCandidates } from './physical-candidates'
import { theCostModel } from './the-cost-model'
import { downToRdds } from './down-to-rdds'
import { readingAPlan } from './reading-a-plan'

export const catalystScenes: Scene[] = [
  oneFrontDoor,
  expressionTree,
  unresolvedPlan,
  theCatalog,
  theAnalyzer,
  rulesToFixpoint,
  predicatePushdown,
  columnPruning,
  physicalCandidates,
  theCostModel,
  downToRdds,
  readingAPlan,
]
