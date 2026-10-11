import { foundations } from './foundations'
import { architecture } from './architecture'
import { abstractions } from './abstractions'
import type { Course, Section } from './types'

// Course registry, in syllabus order (docs/APACHE-SPARK-COURSE-PLAN.md). Courses are added here as
// each is authored:
//   foundations · architecture · abstractions · correctness · query-plans · performance ·
//   streaming · production
//
// ConceptApp needs at least one course: with an empty registry it falls back to
// `Object.values(courses)[0]` and throws reading `.sections`. The app renders from the first course on.
export const COURSES: Record<string, Course> = {
  [foundations.id]: foundations,
  [architecture.id]: architecture,
  [abstractions.id]: abstractions,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract every recorder drives, so it cannot be a per-repo decision. Re-exported here
// because this module is what the app and the scripts import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
