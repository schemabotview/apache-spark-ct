import type { Course, Section } from './types'
import { origins } from './origins'
import { topology } from './topology'
import { rdd } from './rdd'
import { execution } from './execution'
import { shuffle } from './shuffle'
import { catalyst } from './catalyst'
import { tungsten } from './tungsten'
import { pysparkBoundary } from './pyspark-boundary'
import { joins } from './joins'
import { formats } from './formats'
import { memory } from './memory'
import { aqe } from './aqe'
import { streaming } from './streaming'
import { lakehouse } from './lakehouse'
import { capstone } from './capstone'

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// The spine. FROZEN — see COURSE-PLAN.md §"Course order and build order are allowed to differ".
//
// A course id may never be renamed or reordered once its course is authored, because the published
// slug (`<courseId>-<sectionId>`) is the route contract every recorder drives. Fixing the ids up
// front costs nothing and cannot be undone later, so they are declared here in spine order before
// any of them exists.
//
// Fourteen were declared at the outset. `capstone` is the fifteenth, APPENDED on 2026-09-24 when it
// was ported in from the `apache-spark` repo. Appending is safe precisely because this list is a
// catalog ordering and not a dependency chain, and because no existing id moved. It sits last rather
// than among the internals because it is the one course here that BUILDS rather than explains.
//
// This list is the CATALOG ordering, not a dependency chain: every course publishes as a standalone
// search-first video, so no course may assume another has been watched, and narration must never
// cross-reference a module by number ("recall module four"). That is what makes authoring them out
// of spine order safe — and the build order IS out of spine order:
//
//     5 shuffle → 9 joins → 8 pyspark-boundary → 12 aqe → 10 formats, then 6, 4, 11.
// ─────────────────────────────────────────────────────────────────────────────────────────────────
export const SPINE = [
  'origins', //           1 · Why Spark exists (and what MapReduce got wrong)
  'topology', //          2 · What actually runs where when you submit a Spark job
  'rdd', //               3 · What an RDD actually is
  'execution', //         4 · How a Spark job becomes stages and tasks
  'shuffle', //           5 · How the Spark shuffle works            ← flagship, built first
  'catalyst', //          6 · How Spark turns your query into a plan
  'tungsten', //          7 · Why DataFrames beat RDDs
  'pyspark-boundary', //  8 · Why your PySpark UDF is slow
  'joins', //             9 · How Spark decides to join
  'formats', //          10 · Why Parquet is fast
  'memory', //           11 · Where Spark's memory actually goes
  'aqe', //              12 · How Spark re-plans your query while it runs
  'streaming', //        13 · How Structured Streaming actually works
  'lakehouse', //        14 · Why a folder of Parquet is not a table
  'capstone', //         15 · Everything, end to end — the one course that BUILDS
] as const

export type CourseId = (typeof SPINE)[number]

// The live catalog, in spine order. A course joins this registry only when it is authored — an id in
// SPINE with no entry here is planned, not shipped, and the catalog shows exactly what exists.
//
// Authored so far: 1 `origins`, 2 `topology`, 3 `rdd`, 4 `execution`, 5 `shuffle`,
// 6 `catalyst`, 7 `tungsten`, 8 `pyspark-boundary`, 9 `joins`,
// 10 `formats`, 11 `memory`, 12 `aqe`, 13 `streaming`, 14 `lakehouse`, 15 `capstone` (ported).
// ALL FIFTEEN AUTHORED. Insertion order must match SPINE order, not build order
// — this record is what the catalog renders.
export const COURSES: Record<string, Course> = {
  [origins.id]: origins,
  [topology.id]: topology,
  [rdd.id]: rdd,
  [execution.id]: execution,
  [shuffle.id]: shuffle,
  [catalyst.id]: catalyst,
  [tungsten.id]: tungsten,
  [pysparkBoundary.id]: pysparkBoundary,
  [joins.id]: joins,
  [formats.id]: formats,
  [memory.id]: memory,
  [aqe.id]: aqe,
  [streaming.id]: streaming,
  [lakehouse.id]: lakehouse,
  [capstone.id]: capstone,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract the recorder drives, so it cannot be a per-repo decision. Re-exported here because
// this module is what the app and the scripts already import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
