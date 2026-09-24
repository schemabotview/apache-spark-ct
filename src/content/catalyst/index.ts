import type { Course } from '../types'
import {
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
} from './sections'

// Course 6 of the spine — and the course this repo exists to make its case with. See COURSE-PLAN.md
// §2: the canonical Databricks figures of this exact pipeline draw every plan node as an EMPTY BOX,
// so they show the shape and never what changed. §§3–9 here carry the real nodes (Relation, Filter,
// Join, Project, Aggregate) with their actual contents, and name the rule that fired between frames.
//
// The arc: three doors, one tree (§1); everything is a tree (§2); then the pipeline in order —
// unresolved (§3), the catalog that knows what names mean (§4), the analyzer that binds them (§5),
// what a rule IS (§6), and two rules shown firing on real nodes (§§7–8). §9 is the switch from
// algebra to estimation, §10 is the cost model and its one weakness, §11 lands on RDDs, and §12 is
// how to check every claim in the course on your own query.
export const catalyst: Course = {
  id: 'catalyst',
  title: 'How Spark turns your query into a plan',
  sections: [
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
  ],
}
