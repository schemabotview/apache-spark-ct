import type { Course, Section } from './types'
import { shuffle } from './shuffle'
import { joins } from './joins'

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// The spine. FROZEN — see COURSE-PLAN.md §"Course order and build order are allowed to differ".
//
// A course id may never be renamed or reordered once its course is authored, because the published
// slug (`<courseId>-<sectionId>`) is the route contract every recorder drives. Fixing all fourteen
// ids up front costs nothing and cannot be undone later, so they are declared here in spine order
// before any of them exists.
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
] as const

export type CourseId = (typeof SPINE)[number]

// The live catalog, in spine order. A course joins this registry only when it is authored — an id in
// SPINE with no entry here is planned, not shipped, and the catalog shows exactly what exists.
//
// Authored so far: 5 `shuffle`, 9 `joins`. Insertion order must match SPINE order, not build order
// — this record is what the catalog renders.
export const COURSES: Record<string, Course> = {
  [shuffle.id]: shuffle,
  [joins.id]: joins,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract the recorder drives, so it cannot be a per-repo decision. Re-exported here because
// this module is what the app and the scripts already import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
