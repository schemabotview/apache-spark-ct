import { whySpark } from './why-spark'
import { howSparkRuns } from './how-spark-runs'
import { start } from './start'
import { read } from './read'
import type { Course, Section } from './types'

// Course registry, in syllabus order, one entry per course of docs/APACHE-SPARK-COURSE-PLAN.md. A
// course is registered here only once it is authored.
export const COURSES: Record<string, Course> = {
  [whySpark.id]: whySpark,
  [howSparkRuns.id]: howSparkRuns,
  [start.id]: start,
  [read.id]: read,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract every recorder drives, so it cannot be a per-repo decision. Re-exported here
// because this module is what the app and the scripts import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
