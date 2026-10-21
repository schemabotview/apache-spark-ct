import { whySpark } from './why-spark'
import { howSparkRuns } from './how-spark-runs'
import { start } from './start'
import { read } from './read'
import { transform } from './transform'
import { write } from './write'
import { underneath } from './underneath'
import { correct } from './correct'
import { plans } from './plans'
import { fast } from './fast'
import { stream } from './stream'
import type { Course, Section } from './types'

// Course registry, in syllabus order, one entry per course of docs/APACHE-SPARK-COURSE-PLAN.md. A
// course is registered here only once it is authored.
export const COURSES: Record<string, Course> = {
  [whySpark.id]: whySpark,
  [howSparkRuns.id]: howSparkRuns,
  [start.id]: start,
  [read.id]: read,
  [transform.id]: transform,
  [write.id]: write,
  [underneath.id]: underneath,
  [correct.id]: correct,
  [plans.id]: plans,
  [fast.id]: fast,
  [stream.id]: stream,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract every recorder drives, so it cannot be a per-repo decision. Re-exported here
// because this module is what the app and the scripts import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
