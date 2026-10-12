import type { Scene } from '@graphlearning/flow'
import { foundationsScenes } from './foundations'
import { architectureScenes } from './architecture'
import { abstractionsScenes } from './abstractions'
import { correctnessScenes } from './correctness'
import { queryPlansScenes } from './query-plans'
import { performanceScenes } from './performance'
import { streamingScenes } from './streaming'
import { productionScenes } from './production'

// Scene registry. Sections reference scenes by id; scenes are grouped by course (one folder each,
// mirroring src/content). Ids are globally unique across courses, so the flat lookup below is
// unambiguous. Course scene bundles are spread in here as each course is authored.
const ALL: Scene[] = [...foundationsScenes, ...architectureScenes, ...abstractionsScenes, ...correctnessScenes, ...queryPlansScenes, ...performanceScenes, ...streamingScenes, ...productionScenes]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
